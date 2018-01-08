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
  ASyncStorage
} from "react-native";
import { width, height } from 'react-native-dimension'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ActionCreators } from '../../actions'

import Splash from './Splash'
import Modal from 'react-native-modal'
import { signInWithFacebook, signIn, getAllUsers } from '../../lib/api';
import { colors } from "../../config/styles"
import images from "../../config/images"

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    width: width(100) - 140,
    marginLeft: 40,
    marginRight: 40,
    borderColor: colors.buttonBorderColor,
    borderWidth: 1,
    color: colors.white
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "#00000000"
  },
  orButtonText: {
    color: colors.white,
    fontSize: 30,
    textAlign: "center",
    backgroundColor: "#00000000",
    fontWeight: "600"
  },
  buttonContainer: {
    flex: 1,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row"
  },
  loginButton: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500"
  },
  seperator: {
    width: 1,
    justifyContent: "center",
    backgroundColor: colors.white
  }
});

class SplashContainer extends Component {
  static navigationOptions = { title: "Welcome", header: null };

  constructor(props) {
    super(props);
    this.initialState = {
      currentPage: 0,
      isLoading: false,
      user: this.props.user,
    };
    this.state = this.initialState;
    this.currentUser = null;
  }

  async componentDidMount() {
  }

  startAction() {
    this.props.navigation.navigate('LogIn');
  }

  render() {
    return (
      <View>
        <Splash
          startAction={this.startAction.bind(this)}
          {...this.state}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(SplashContainer);
