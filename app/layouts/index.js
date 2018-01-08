import { StackNavigator } from 'react-navigation';
import LoggedOut from './LoggedOut';

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      LoggedOut: {
        screen: LoggedOut,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: 'LoggedOut',
    },
  );
};
