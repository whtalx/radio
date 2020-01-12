import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import player from './reducers/player'
import list from './reducers/list'
import api from './reducers/api'

export default configureStore({
  reducer: combineReducers({
    player,
    list,
    api,
  }),
  middleware: getDefaultMiddleware(),
})
