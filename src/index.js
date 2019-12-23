import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom'
import store from './store';
import App from './App'
import './index.css'

ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <Route path={ `/` } component={ App }/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
