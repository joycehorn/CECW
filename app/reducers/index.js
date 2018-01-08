import { combineReducers } from 'redux';
import * as userReducer from './user';
import * as persistReducer from './persist';
import * as connectionReducer from './connectionState';

export default combineReducers(Object.assign(
  userReducer,
  persistReducer,
  connectionReducer,
));
