import React, { useContext } from 'react'

import { StateContext } from '../../store'

import { Wrapper } from './styled'
import TitleBar from './TitleBar'
import Drawer from '../Drawer'
import Player from '../Player'
import Main from './Main'

export default function Window() {
  const state = useContext(StateContext)
  const { window: { drawer } } = state

  return (
    <Wrapper>
      <TitleBar />
      <Main resizable={!drawer}>
        <Player />
      </Main>
      <Drawer />
    </Wrapper>
  )
}
