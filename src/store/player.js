import { createStore } from 'redux'
import player from './reducers/player'

export default createStore(
  player,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
