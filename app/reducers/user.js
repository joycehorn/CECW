import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const user = createReducer(
  {},
  {
    [types.SET_USER_SESSION](state, action) {
      return action.user;
    },
  },
);
