import * as types from './types';
import { signin, signup } from '../lib/api';

export function setUser({ user }) {
  return {
    type: types.SET_USER_SESSION,
    user,
  };
}

// export function setData({ image }) {
//   return {
//     type: types.SET_TEMP_IMAGE,
//     image,
//   };
// }

export function logout() {
  return (dispatch) => {
    dispatch(setUser({ user: null }));
  };
}

export function login(user) {
  return (dispatch) => {
    dispatch(setUser({ user: user }));
  };
}