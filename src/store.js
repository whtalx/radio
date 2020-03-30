import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import player from './reducers/player'
import list from './reducers/list'
import api from './reducers/api'

const getSavedState = ({ list, player }) => {
  const storedList = localStorage.getItem(`list`)
  const storedPlayer = localStorage.getItem(`player`)
  return {
    list: storedList
      ? JSON.parse(storedList)
      : list(undefined, {}),

    player: storedPlayer
      ? {
        ...player(undefined, {}),
        ...JSON.parse(storedPlayer),
        currentState: `paused`,
      }
      : player(undefined, {}),
  }
}

const store = configureStore({
  reducer: combineReducers({ api, list, player }),
  middleware: getDefaultMiddleware(),
  preloadedState: getSavedState({ list, player }),
})

store.subscribe(() => {
  const { list, player } = store.getState()
  localStorage.setItem(`list`, JSON.stringify(list))
  localStorage.setItem(`player`, JSON.stringify(player))
})

export default store
