import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store/player'
import Window from '../components/Window'
import Player from '../components/Player'

export default () =>
  <Window title={ `WebRadio` } buttons={ [`minimize`, `close`] }>
    <Provider store={ store }>
      <Player />
    </Provider>
  </Window>
