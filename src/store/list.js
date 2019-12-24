import { createStore, combineReducers } from 'redux'
import list from './reducers/list'
import api from './reducers/api'

export default createStore(
  combineReducers({
    list,
    api,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
