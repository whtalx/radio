import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import player from './reducers/player'
import list from './reducers/list'
import api from './reducers/api'

const getState = () => {
  const storedList = localStorage.getItem(`list`)
  const storedPlayer = localStorage.getItem(`player`)
  const list = storedList ? JSON.parse(storedList) : undefined
  const player = storedPlayer ? { ...JSON.parse(storedPlayer), currentState: `paused` } : undefined
  return { list, player }
}

const store = configureStore({
  reducer: combineReducers({ api, list, player }),
  middleware: getDefaultMiddleware(),
  preloadedState: getState(),
})

store.subscribe(() => {
  const { list, player } = store.getState()
  localStorage.setItem(`list`, JSON.stringify(list))
  localStorage.setItem(`player`, JSON.stringify(player))
})

export default store
