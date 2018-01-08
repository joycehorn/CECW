import React, { Component } from 'react';
import { Platform, StatusBar, View, Image, StyleSheet, Text } from 'react-native';
import { DrawerNavigator, StackNavigator, Header, TabNavigator } from 'react-navigation';
import { width, height } from 'react-native-dimension';
import DeviceInfo from 'react-native-device-info';
import Splash from '../routes/Splash';
import LogIn from '../routes/LogIn';
import SearchName from '../routes/SearchName';
import Dashboard from '../routes/Dashboard';
import { colors } from '../config/styles';
import images from '../config/images';

const headerStyle = {
  marginTop: 0,
};

const mapNavigationStateParamsToProps = (SomeComponent) => {
  return class extends Component {
    static navigationOptions = SomeComponent.navigationOptions; // better use hoist-non-react-statics
    render() {
      const { navigation: { state: { params } } } = this.props;
      return <SomeComponent {...params} {...this.props} />;
    }
  };
};

const headerTintColor = 'white';

export const routes = {
  getSignOutRoute() {
    return StackNavigator(
      {
        Splash: {
          screen: Splash,
          navigationOptions: {
            title: 'Splash',
            headerStyle,
            headerBackTitle: null,
          },
        },
        LogIn: {
          screen: LogIn,
          navigationOptions: {
            title: 'LogIn',
            headerStyle,
            headerBackTitle: null,
          },
        },
        Dashboard: {
          screen: Dashboard,
          navigationOptions: {
            title: 'Dashboard',
            headerStyle,
            headerBackTitle: null,
          },
        },
        SearchName: {
          screen: SearchName,
          navigationOptions: {
            title: 'SearchName',
            headerStyle,
            headerBackTitle: null,
          },
        },
      },
      {
        headerMode: 'none',
      },
    );
  }
};

export default routes;
