import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import store from './store'
import Window from './components/Window'
import './index.css'

ReactDOM.render(
  <Provider store={ store }>
    <Helmet>
      <title>WebRadio</title>
    </Helmet>
    <Window />
  </Provider>,
  document.getElementById('root')
)
