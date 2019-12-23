import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store/renderer'
import Player from '../components/Player'

export default () =>
  <Provider store={ store }>
    <Player />
  </Provider>
