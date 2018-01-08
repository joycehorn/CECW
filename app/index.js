import React, { Component } from 'react';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate, persistStore } from "redux-persist";
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { AsyncStorage, NetInfo } from 'react-native';

import reducer from './reducers';
import { createRootNavigator } from './layouts';
import { update } from './actions/persist';
import { connectionState } from './actions/connectionState';

// middleware that logs actions
const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

function configureStore(initialState) {
  const enhancer = compose(applyMiddleware(thunkMiddleware), autoRehydrate()); // lets us dispatch() functions
      // loggerMiddleware,
  return createStore(reducer, initialState, enhancer);
}

export const store = configureStore({});
persistStore(store, { storage: AsyncStorage, whitelist: ['user'] }, () => store.dispatch(update({ isHydrated: true })));

export default class cecw extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignedIn: false,
    };
  }

  componentDidMount() {
    const unsubscribe = store.subscribe(() => {
      if (store.getState().persist.isHydrated) {
        unsubscribe();
        this.setState({ signedIn: false, checkedSignedIn: true });
      }
    });

    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
  }

  _handleConnectionChange = (isConnected) => {
    store.dispatch(connectionState({ status: isConnected }));
  };

  render() {
    const { checkedSignedIn, signedIn } = this.state;

    if (!checkedSignedIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  }
}
