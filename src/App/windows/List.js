import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store/list'
import List from '../components/List'

export default () =>
  <Provider store={ store }>
    <List />
  </Provider>
