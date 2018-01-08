import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const isConnected = createReducer({ isConnected: false }, {
  [types.CHANGE_CONNECTION_STATUS](state, action) {
    return Object.assign({}, state, {
      isConnected: action.isConnected,
    });
  },
});
