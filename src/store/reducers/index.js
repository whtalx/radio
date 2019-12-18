import { combineReducers } from 'redux'
import player from './player'
import list from './list'
import api from './api'

export default combineReducers({
  player,
  list,
  api,
})
