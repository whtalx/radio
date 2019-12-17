import { combineReducers } from 'redux'
import player from './player'
import api from './api'

export default combineReducers({
  player,
  api,
})
