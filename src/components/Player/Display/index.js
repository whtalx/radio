import React from 'react'

import Time from './Time'
import Info from './Info'
import State from './State'
import Ticker from './Ticker'
import Visualisation from './Visualisation'
import { Background, Content, Overlay, Spacer, Wrapper } from './styled'

import overlayLeft from './images/display-left.png'
import overlayCenter from './images/display-center.png'

export default function Display({ info, title, status, state }) {
  return (
    <Wrapper>
      <Background>
        <Overlay src={ overlayLeft } />
        <Overlay src={ overlayCenter } />
        <Overlay src={ overlayLeft } />
      </Background>
      <Content>
        <State state={ state } />
        <Time state={ state } />
        <Spacer />
        <Info { ...info } />
        <Spacer />
        <Visualisation state={ state } />
      </Content>
      <Ticker title={ title } status={ status } />
    </Wrapper>
  )
}
