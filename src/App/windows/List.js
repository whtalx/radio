import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store/renderer'
import List from '../components/List'

export default () =>
  <Provider store={ store }>
    <List />
  </Provider>
