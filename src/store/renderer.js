import { compose, createStore } from 'redux'
import { electronEnhancer } from 'redux-electron-store'
import reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancers = composeEnhancers(
  electronEnhancer(true)
)

export default createStore(reducers, {}, enhancers)
