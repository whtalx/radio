import React from 'react'

import { Wrapper } from './styled'
import TitleBar from './TitleBar'
import Drawer from '../Drawer'
import Player from '../Player'
import Main from './Main'

export default function Window() {
  return (
    <Wrapper>
      <TitleBar />
      <Main>
        <Player />
      </Main>
      <Drawer />
    </Wrapper>
  )
}
