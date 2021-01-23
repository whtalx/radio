import React from 'react'
import { ipcRenderer } from 'electron'

import {
  Menu,
  Hide,
  Title,
  Close,
  Wrapper,
  Contents,
  SpacerLeft,
  Background,
  SpacerRight,
} from './styled'

import logo from './images/logo-center.png'
import logoLeft from './images/logo-left.png'
import logoRight from './images/logo-right.png'
import logoSpacer from './images/logo-spacer.png'
import left from './images/background-left.png'
import right from './images/background-right.png'
import center from './images/background-center.png'

export default function TitleBar() {
  function hide() {
    ipcRenderer.send(`control`, `minimize`)
  }

  function close() {
    ipcRenderer.send(`control`, `close`)
  }

  return (
    <Wrapper>
      <Background src={ left } />
      <Background src={ center } />
      <Background src={ right } />
      <Contents>
        <Menu />
        <Title src={ logoLeft } width="5px" />
        <SpacerLeft src={ logoSpacer } />
        <Title src={ logo } width="85px" />
        <SpacerRight src={ logoSpacer } />
        <Title src={ logoRight } width="5px" />
        <Hide onClick={ hide } />
        <Close onClick={ close } />
      </Contents>
    </Wrapper>
  )
}
