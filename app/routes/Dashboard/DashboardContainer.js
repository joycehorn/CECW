import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  ASyncStorage,
  Alert
} from "react-native";
import { width, height } from 'react-native-dimension'
import { NavigationActions } from 'react-navigation'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { EventRegister } from 'react-native-event-listeners'
import { ActionCreators } from '../../actions'

import Dashboard from './Dashboard'
import Modal from 'react-native-modal'
import { lookupIdentifier, logVisit, updateRego, giveWashcard } from '../../lib/api';
import { colors } from "../../config/styles"
import images from "../../config/images"

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    marginTop: 10,
    padding: 5,
    backgroundColor: colors.buttonBackgroundColor,
    borderRadius: 5,
    borderColor: colors.borderColor,
    borderWidth: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.3,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  modalContainer: {
    padding: 1,
    width: width(50),
    height: width(15),
    marginTop: -width(11) - 5,
    marginLeft: width(30) - 50,
    backgroundColor: colors.transparent
  },
  imageContainer: {
    position: 'absolute',
    marginTop: 1,
    width: width(50),
    marginLeft: 0,
    height: 14,
    justifyContent: 'center'
  },
  imageView: {
    width: 22,
    height: 14,
    alignSelf: 'center'
  },
  modalTextField: {
    width: width(30),
    height: width(8),
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.textFieldBorderColor,
    shadowColor: colors.textFieldShadowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  textContent: {
    fontSize: 25,
    backgroundColor: colors.transparent,
    color: colors.black,
    textAlign: 'center'
  },
  button: {
    width: 90,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonBackgroundColor,
		borderRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1
  }
});

class DashboardContainer extends Component {
  static navigationOptions = { title: "Welcome", header: null };

  constructor(props) {
    super(props);
    this.initialState = {
      currentPage: 0,
      isLoading: false,
      selectedTab: 0,
      visitHistory: [],
      freeWashHistory: [],
      washCards: [],
      modalVisible: false,
      visitModalVisible: false,
      regoName: 'ABC123',
      tempRego: 'ABC123',
      regoId: '',
      frequentVisit: false,
      logVisitItem: null,
      giveWashConfirmVisible: false,
      regoNameLengthVisible: false
    };
    this.state = this.initialState;
    this.currentUser = null;
  }

  componentDidMount() {
    let temp = this.props.navigation.state.params.user.vehicleRegistrations[this.props.navigation.state.params.regoNumber];
    console.log(JSON.stringify(this.props.navigation.state.params.user));
    this.setState({ regoName: temp.registrationNumber, regoId: temp.id });
    let i;
    let washCodeData = [];
    let washCardData = [];
    let visitHistoryData = [];
    for ( i = 0; i < this.props.navigation.state.params.user.washcodes.length; i += 1) {
      if (this.props.navigation.state.params.user.washcodes[i].registrationId === temp.id ) {
        washCodeData.push(this.props.navigation.state.params.user.washcodes[i]);
      }
    }
    for ( i = 0; i < this.props.navigation.state.params.user.visits.length; i += 1) {
      if (this.props.navigation.state.params.user.visits[i].registrationId === temp.id ) {
        visitHistoryData.push(this.props.navigation.state.params.user.visits[i]);
      }
    }
    for ( i = 0; i < this.props.navigation.state.params.user.washcards.length; i += 1) {
      washCardData.push(this.props.navigation.state.params.user.washcards[i]);
    }
    visitHistoryData = visitHistoryData.sort(function(a, b) {
      if (moment(a.date).isBefore(moment(b.date))) {
        return 1;
      }
      return -1;
    });
    visitHistoryData = visitHistoryData.sort(function(a, b) {
      let valA = 0;
      let valB = 0;
      if (a.usedDate !== null) {
        valA = 2;
      } else if (moment(a.endDate).isBefore(moment()) === true) {
        valA = 1;
      }
      if (b.usedDate !== null) {
        valB = 2;
      } else if (moment(b.endDate).isBefore(moment()) === true) {
        valB = 1;
      }
      if (valA <= valB) {
        return -1;
      }
      return 1;
    });
    this.setState({
      user: this.props.navigation.state.params.user,
      visitHistory: visitHistoryData,
      freeWashHistory: washCodeData,
      washCards: washCardData
    });
  }

  goBack() {
    EventRegister.emit('goBack');
    this.props.navigation.dispatch(NavigationActions.back());
  }

  fixingRego() {
    this.setState({ modalVisible: true, tempRego: this.state.regoName });
  }

  confirmRego(flag) {
    if (this.state.regoName === this.state.tempRego) {
      this.setState({ modalVisible: false });
      return;
    }
    if (flag === false) {
      if (this.state.tempRego.length > 6) {
        Alert.alert(
          '',
          'This rego is more than 6 charactes, Is this correct?',
          [
            {text: 'YES', onPress: () => {this.confirmRego(true);}, style: 'cancel'},
            {text: 'FIX', onPress: () => console.log('fix Pressed')},
          ],
          { cancelable: false }
        )
        return;
      }
    }
    this.setState({ modalVisible: false });
    this.setState({ isLoading: true });
    updateRego(`${this.state.regoId},${this.state.tempRego}`).then( response => {
      if (response.result === true) {
        this.setState({ regoName: this.state.tempRego });
      }
      else {
        this.setState({ tempRego: this.state.regoName });
        alert(response.message);
      }
      this.setState({ isLoading: false });
    })
    .catch((error) => {
      this.setState({ tempRego: this.state.regoName });
      this.setState({ isLoading: false });
    });
  }

  showVisitModal(item) {
    this.setState({ visitModalVisible: true, logVisitItem: item });
  }

  checkValidVisitDate() {
    let i;
    for ( i = 0; i < this.state.visitHistory.length ; i += 1 ) {
      let item = this.state.visitHistory[i];
      if (moment(item.date).diff(moment().subtract(1, 'hour')) >= 0) {
        this.setState({ frequentVisit: true });
        return;
      }
    }
    this.logVisit('');
  }

  giveWashCard(flag) {
    if (flag === false) {
      this.setState({ giveWashConfirmVisible: true });
    }
    else {
      this.setState({ isLoading: true });
      giveWashcard(`${this.state.user.id}`).then( response => {
        if (response.result === true) {
          this.goBack();
        }
        else {
          alert(response.message);
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        alert(error);
        this.setState({ isLoading: false });
      });
    }
  }

  logVisit(washcode) {
    this.setState({ isLoading: true });
    let data = ``;
    if (washcode === '')
    {
      data = `${this.state.regoId}`
    }
    else {
      data = `${this.state.regoId},${washcode}`
    }
    logVisit(data).then( response => {
      if (response.result === true) {
        this.setState({ isLoading: false });
        this.goBack();
      }
      else {
        alert(response.message);
      }
      this.setState({ isLoading: false });
    })
    .catch((error) => {
      alert(error);
      this.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <View>
        <Dashboard
          fixingRego={this.fixingRego.bind(this)}
          giveWashCard={this.giveWashCard.bind(this)}
          updateState={this.setState.bind(this)}
          goBack={this.goBack.bind(this)}
          checkValidVisitDate={this.checkValidVisitDate.bind(this)}
          showVisitModal={this.showVisitModal.bind(this)}
          logVisit={this.logVisit.bind(this)}
          {...this.state}
        />
        <Modal isVisible={this.state.modalVisible} onBackdropPress={() => this.confirmRego(false)} backdropOpacity={0}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center' }}>Edit rego</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <TextInput value={this.state.tempRego} onChangeText={(text) => this.setState({ tempRego: text })} style={styles.modalTextField}></TextInput>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Image source={images.triangle} style={styles.imageView} resizeMode="cover"></Image>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.visitModalVisible} onBackdropPress={() => {this.setState({ visitModalVisible: false })}} backdropOpacity={0}>
          <View style={[styles.modalContainer, { height: width(25) }]}>
            <View style={styles.modalContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
              </View>
              <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textContent}>This has expired, use it anyway?</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.logVisit(this.state.logVisitItem.washcode); this.setState({ visitModalVisible: false })}}>
                      <Text style={styles.textContent}>YES</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.setState({ visitModalVisible: false })}}>
                      <Text style={styles.textContent}>NO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.giveWashConfirmVisible} onBackdropPress={() => {this.setState({ giveWashConfirmVisible: false })}} backdropOpacity={0}>
          <View style={[styles.modalContainer, { height: width(25) }]}>
            <View style={styles.modalContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
              </View>
              <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textContent}>Are you giving this customer a wash card?</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.giveWashCard(true); this.setState({ giveWashConfirmVisible: false })}}>
                      <Text style={styles.textContent}>yes</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.setState({ giveWashConfirmVisible: false })}}>
                      <Text style={styles.textContent}>cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.regoNameLengthVisible} backdropOpacity={0}>
          <View style={[styles.modalContainer, { height: width(25) }]}>
            <View style={styles.modalContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
              </View>
              <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textContent}>This rego is more than 6 charactes, Is this correct?</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.confirmRego(true); this.setState({ regoNameLengthVisible: false })}}>
                      <Text style={styles.textContent}>yes</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.setState({ regoNameLengthVisible: false })}}>
                      <Text style={styles.textContent}>fix</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.frequentVisit} onBackdropPress={() => {this.setState({ frequentVisit: false })}} backdropOpacity={0}>
          <View style={[styles.modalContainer, { height: width(25) }]}>
            <View style={styles.modalContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
              </View>
              <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textContent}>{'Last visit was less than an hour ago.\nAre you sure?'}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.logVisit(''); this.setState({ frequentVisit: false })}}>
                      <Text style={styles.textContent}>Visit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {this.setState({ frequentVisit: false })}}>
                      <Text style={styles.textContent}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
