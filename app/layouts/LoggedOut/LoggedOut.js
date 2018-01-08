import React from 'react';
import { View } from 'react-native';

import Routes from '../../config/routes';

const LoggedOut = (navigation) => {
  const Route = Routes.getSignOutRoute();
  return <Route screenProps={{ rootNavigation: navigation }} />;
};

export default LoggedOut;
