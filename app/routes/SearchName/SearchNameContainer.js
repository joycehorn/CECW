import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Keyboard,
  TextInput,
  ASyncStorage
} from "react-native";
import { width, height } from 'react-native-dimension'
import { EventRegister } from 'react-native-event-listeners'
import Spinner from 'react-native-spinkit'
import { NavigationActions } from 'react-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ActionCreators } from '../../actions'

import SearchName from './SearchName'
import Modal from 'react-native-modal'
import { lookupIdentifier, addRego } from '../../lib/api';
import { colors } from "../../config/styles"
import images from "../../config/images"

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    marginTop: 10,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
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
    width: width(30),
    height: height(40),
    backgroundColor: colors.transparent,
    alignSelf: 'center'
  },
  imageContainer: {
    position: 'absolute',
    marginTop: 1,
    width: width(30),
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
    width: width(26),
    height: height(35) - 50,
    alignSelf: 'center',
    marginTop: height(4),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderColor,
    shadowColor: colors.borderColor,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  numberButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: colors.buttonBackgroundColor,
    borderWidth: 1,
    justifyContent: 'center',
    aspectRatio: 1
  },
  textContent: {
    fontSize: 25,
    backgroundColor: colors.transparent,
    color: colors.black,
    textAlign: 'center'
  },
  textInput: {
    fontSize: 20,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderColor: colors.borderColor,
    borderWidth: 1,
    color: colors.black
  },
  button: {
    width: 90,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonBackgroundColor,
		borderRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1
  },
  modalConfirmContainer: {
    padding: 1,
    width: width(50),
    height: width(15),
    marginTop: -width(11) - 5,
    marginLeft: width(30) - 50,
    backgroundColor: colors.transparent
  },
  modalConfirmContent: {
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
    elevation: Platform.OS === "android" ? 2 : 0
  },
  textConfirmContent: {
    fontSize: 25,
    backgroundColor: colors.transparent,
    color: colors.black,
    textAlign: 'center'
  },
  buttonConfirm: {
    width: 90,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonBackgroundColor,
    borderRadius: 5,
    borderColor: colors.borderColor,
    borderWidth: 1
  },
});

class SearchNameContainer extends Component {
  static navigationOptions = { title: "Welcome", header: null };

  constructor(props) {
    super(props);
    this.initialState = {
      currentPage: 0,
      isLoading: false,
      users: this.props.navigation.state.params.users,
      keyword: this.props.navigation.state.params.keyword,
      selectedTab: 0,
      modalVisible: false,
      itemKey: 0,
      addNewRego: false,
      regoNames: [],
      regoName: '',
      addRegoButtonTappedFlag: false,
      regoNameLengthVisible: false
    };
    this.state = this.initialState;
    this.currentUser = null;
  }

  componentWillMount() {
    this.backListener = EventRegister.addEventListener('goBack', () => {
      setTimeout(() => {
        this.props.navigation.dispatch(NavigationActions.back());
      }, 500)
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.backListener);
  }

  componentDidMount() {
    let i = 0;
    let tempRegoNames = [];
    for ( i = 0; i < this.props.navigation.state.params.users.length; i += 1) {
      let tempUser = this.props.navigation.state.params.users[i];
      let j = 0;
      let tempName = '';
      for ( j = 0; j < tempUser.vehicleRegistrations.length; j += 1 ) {
        
        tempName += tempUser.vehicleRegistrations[j].registrationNumber;
        if ( j < (tempUser.vehicleRegistrations.length - 1) ) {
          tempName += ', ';
        }
      }
      tempRegoNames.push({ name: tempName, key: i });
    }
    this.setState({ users: this.props.navigation.state.params.users, regoNames: tempRegoNames });
  }

  goBack() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  selectRego(key) {
    if (this.state.users[key].vehicleRegistrations.length > 0) {
      if ( this.state.users[key].vehicleRegistrations.length === 1 ) {
        this.setState({ itemKey: key });
        setTimeout(() => {
          this.regoSelected(0);
        }, 300);
      }
      else {
        this.setState({ modalVisible: true, itemKey: key })
      }
    }
    else {
      this.setState({ addNewRego: true, itemKey: key })
    }
  }

  addRegoButtonTapped(key) {
    this.setState({ addNewRego: true, itemKey: key, addRegoButtonTappedFlag: true });
  }

  confirmRego() {
    this.setState({ modalVisible: false })
  }

  regoSelected(num) {
    this.setState({ selectedTab: num, modalVisible: false });
    this.props.navigation.navigate('Dashboard', { user: this.state.users[this.state.itemKey], regoNumber: num });
  }

  addNewRegoToUser(flag) {
    if (this.state.regoName === '') {
      alert('Please input rego name');
      return;
    }
    if (flag === false) {
      if (this.state.regoName.length > 6) {
        this.setState({ regoNameLengthVisible: true });
        return;
      }
    }
    this.setState({ isLoading: true, addRegoButtonTappedFlag: false, addNewRego: false });
    let param = '';
    param = `${this.state.users[this.state.itemKey].id},${this.state.regoName}`;
    addRego(param).then( response => {
      if (response.result === true) {
        lookupIdentifier(this.state.keyword).then( response => {
          this.setState({ isLoading: false });
          if (response.result === false) {
            alert(response.message);
          }
          else {
            this.setState({ addNewRego: false })
            let users = [];
            for (let tempKey = 0; ; tempKey += 1) {
              if (response.users[`${tempKey}`] !== undefined) {
                users.push(response.users[`${tempKey}`]);
              } else {
                break;
              }
            }
            let i = 0;
            let tempRegoNames = [];
            for ( i = 0; i < users.length; i += 1) {
              let tempUser = users[i];
              let j = 0;
              let tempName = '';
              for ( j = 0; j < tempUser.vehicleRegistrations.length; j += 1 ) {
                
                tempName += tempUser.vehicleRegistrations[j].registrationNumber;
                if ( j < (tempUser.vehicleRegistrations.length - 1) ) {
                  tempName += ', ';
                }
              }
              tempRegoNames.push({ name: tempName, key: i });
            }
            this.setState({ users, regoNames: tempRegoNames, itemKey: 0 });
            // if (users.length === 1 ) {
            //   if (users[0].vehicleRegistrations.length === 1)
            //   {
            //     this.setState({ regoName: '' });
            //     this.props.navigation.navigate('Dashboard', { user: users[0], regoNumber: 0 });
            //   }
            //   else {
            //     let i = 0;
            //     for ( i = 0; i < users[0].vehicleRegistrations.length; i += 1) {
            //       if (users[0].vehicleRegistrations[i].registrationNumber === this.state.regoName) {
            //         break;
            //       }
            //     }
            //     this.setState({ regoName: '' });
            //     if (i === users[0].vehicleRegistrations.length) {
            //       alert("Add New Rego Failed.\nPlease try again later.");
            //     }
            //     else {
            //       this.props.navigation.navigate('Dashboard', { user: users[0], regoNumber: i });
            //     }
            //   }
            // }
            // else {
            //   this.setState({ regoName: '' });
            //   alert("Add New Rego Failed.\nPlease try again later.");
            // }
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
        });
      }
      else {
        this.setState({ isLoading: false });
        alert(response.message);
      }
    })
    .catch((error) => {
      this.setState({ isLoading: false });
    });
  }

  updateText(text) {
    let tempText = '';
    tempText = this.state.regoName;
    if (text === 'back') {
      tempText = tempText.slice(0, tempText.length - 1);
    }
    else {
      tempText += text;
    }
    this.setState({ regoName: tempText });
  }

  render() {
    return (
      <View>
        <SearchName
          selectRego={this.selectRego.bind(this)}
          updateState={this.setState.bind(this)}
          addRegoButtonTapped={this.addRegoButtonTapped.bind(this)}
          goBack={this.goBack.bind(this)}
          {...this.state}
        />
        <Modal isVisible={this.state.modalVisible} onBackdropPress={() => this.confirmRego()} backdropOpacity={0}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center' }}>Popover</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.modalTextField}>
                  <ScrollView style={{ flex: 1, padding: 10 }}>
                    {this.state.users[this.state.itemKey].vehicleRegistrations.map((rego, key) => {
                      return (
                        <TouchableOpacity style={{ height: height(7), justifyContent: 'center' }} onPress={() => this.regoSelected(key)}>
                          <Text style={{ fontSize: 25, textAlign: 'center' }}>{rego.registrationNumber}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Image source={images.triangle} style={styles.imageView} resizeMode="cover"></Image>
            </View>
          </View>
        </Modal>
        {this.state.addNewRego ? <View style={{ position: 'absolute', height: height(50) - width(12) - 40, width: width(75), top: (width(12) + 20), left: width(12.5) }}>
            <View style={styles.modalContent}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20 }}>{this.state.addRegoButtonTappedFlag === false ? `No rego found. Add new?` : 'Add new Rego'}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textContent}>Rego</Text>
                </View>
                <View style={{ flex: 3, padding: 5 }}>
                  <TextInput
                    value={this.state.regoName}
                    style={[styles.textInput, { borderWidth: 5 }]}
                    onFocus={() => {Keyboard.dismiss()}}
                    autoCapitalize="none"
                    pointerEvents="none"
                    underlineColorAndroid="#00000000"
                    onChangeText={(text) => this.setState({ regoName: text })}>
                  </TextInput>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity style={styles.button} onPress={() => {this.setState({ addNewRego: false, regoName: '', addRegoButtonTappedFlag: false })}}>
                    <Text style={styles.textContent}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity style={styles.button} onPress={() => {this.addNewRegoToUser(false)}}>
                    <Text style={styles.textContent}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>: null}
        {this.state.addNewRego ? <View style={{ position: 'absolute', height: width(28), width: width(65), top: height(50), left: width(17.5) }}>
          <View style={{ height: width(6.5) - 9, marginTop: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '1' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '2' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '3' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '4' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '5' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '6' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '7' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '8' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '9' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numberButton, { marginRight: 0 }]} onPress={() => this.updateText( '0' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>0</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: width(6.5) - 9, marginTop: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'q' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>q</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'w' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>w</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'e' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>e</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'r' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>r</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 't' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>t</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'y' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>y</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'u' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>u</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'i' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>i</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'o' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>o</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numberButton, { marginRight: 0 }]} onPress={() => this.updateText( 'p' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>p</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: width(6.5) - 9, marginTop: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={[styles.numberButton, { marginLeft: width(3.25) + 0.5 }]} onPress={() => this.updateText( 'a' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>a</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 's' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>s</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'd' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>d</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'f' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'g' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>g</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'h' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>h</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'j' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>j</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'k' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numberButton, { marginRight: width(3.25) + 0.5 }]} onPress={() => this.updateText( 'l' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>l</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: width(6.5) - 9, marginTop: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '@' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>@</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'z' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>z</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'x' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>x</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'c' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>c</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'v' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>v</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'b' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>b</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'n' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>n</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( 'm' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={() => this.updateText( '.' )}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numberButton, { marginRight: 0 }]} onPress={() => this.updateText('back')}>
              <Image  source={images.backspaceImage} style={{ width: width(6.5) - 9, height: width(6.5) - 9 }} resizeMode="stretch"/>
            </TouchableOpacity>
          </View>
        </View> : null}
        <Modal isVisible={this.state.regoNameLengthVisible} backdropOpacity={0}>
          <View style={[styles.modalConfirmContainer, { height: width(25) }]}>
            <View style={styles.modalConfirmContent}>
              <View style={{ height: 15, justifyContent: 'center' }}>
              </View>
              <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.textConfirmContent}>This rego is more than 6 charactes, Is this correct?</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.buttonConfirm} onPress={() => {this.addNewRegoToUser(true); this.setState({ regoNameLengthVisible: false })}}>
                      <Text style={styles.textConfirmContent}>yes</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.buttonConfirm} onPress={() => {this.setState({ regoNameLengthVisible: false })}}>
                      <Text style={styles.textConfirmContent}>fix</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {this.state.isLoading === true ? <View style={{ position: 'absolute', width: width(100), height: height(100), backgroundColor: colors.transparent, left: 0, top: 0, justifyContent: 'center' }}>
          <Spinner style={{ alignSelf: 'center' }} isVisible={this.state.isLoading} size={100} type="FadingCircleAlt" color={colors.textFieldBorderColor}/>
        </View> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchNameContainer);
