import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const persist = createReducer(
  {},
  {
    [types.UPDATE_PERSIST](state, action) {
      return action.payload;
    },
  },
);
