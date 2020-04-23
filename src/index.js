import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Window from './components/Window'
import store from './store'
import { saveState } from './functions'
import './index.css'

window.webAudio = new AudioContext()

store.subscribe(saveState(store))

ReactDOM.render(
  <Provider store={ store }><Window /></Provider>,
  document.getElementById('root')
)
