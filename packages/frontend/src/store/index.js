import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import stories from './stories';
import authors from './authors';

const store = configureStore({
  reducer: combineReducers({ stories, authors }),
});

export default store;
