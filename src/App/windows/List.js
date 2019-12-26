import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store/list'
import Window from '../components/Window'
import List from '../components/List'

export default () =>
  <Window title={ `WebRadio Stations` } buttons={ [`hide`] }>
    <Provider store={ store }>
      <List />
    </Provider>
  </Window>
