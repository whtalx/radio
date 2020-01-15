import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import player from './reducers/player'
import list from './reducers/list'
import api from './reducers/api'

const getState = () => {
  const storedList = localStorage.getItem(`list`)
  const storedPlayer = localStorage.getItem(`player`)
  const list = storedList && JSON.parse(storedList)
  const player = storedPlayer && JSON.parse(storedPlayer)
  player && player.currentState === `playing` && (player.currentState = `pending`)
  return {
    list,
    player
  }
}


const store = configureStore({
  reducer: combineReducers({
    player,
    list,
    api,
  }),
  middleware: getDefaultMiddleware(),
  preloadedState: getState(),
})

store.subscribe(() => {
  const { list, player } = store.getState()
  localStorage.setItem(`list`, JSON.stringify(list))
  localStorage.setItem(`player`, JSON.stringify(player))
})

export default store
