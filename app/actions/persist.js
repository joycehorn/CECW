import * as types from './types';

export const update = (payload) => ({
  type: types.UPDATE_PERSIST,
  payload,
});
