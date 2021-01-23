import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { player, list, api } from './reducers'
import { getSavedState } from './functions'

export default configureStore({
  reducer: combineReducers({ api, list, player }),
  middleware: getDefaultMiddleware(),
  preloadedState: getSavedState({ list, player }),
})
