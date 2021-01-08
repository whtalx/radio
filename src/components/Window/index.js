import React, { useState } from 'react'
import { ipcRenderer } from 'electron'

import { Wrapper } from './styled'

import TitleBar from './TitleBar'
import Drawer from '../Drawer'
import Player from '../Player'
import Main from './Main'
import List from '../Drawer/List'

export default function Window() {
  const [opened, setOpened] = useState(false)

  function toggle() {
    const value = !opened
    setOpened(value)
    ipcRenderer.send(`setHeight`, value ? 484 : 0, 133)
  }

  return (
    <Wrapper drawer={ opened }>
      <TitleBar />
      <Main>
        <Player />
      </Main>
      <Drawer opened={ opened } toggle={ toggle }>
        <List />
      </Drawer>
    </Wrapper>
  )
}
