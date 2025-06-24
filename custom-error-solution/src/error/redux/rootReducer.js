import { combineReducers } from '@reduxjs/toolkit';
import errorReducer from './errorSlice';

const rootReducer = combineReducers({
  error: errorReducer,
});

export default rootReducer;