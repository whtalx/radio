import { createStore, combineReducers } from 'redux'
import player from './reducers/player'
import list from './reducers/list'
import api from './reducers/api'

export default createStore(
  combineReducers({
    player,
    list,
    api,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
