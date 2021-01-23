import React from 'react'

import Time from './Time'
import Info from './Info'
import Ticker from './Ticker'
import Indicators from './Indicators'
import Visualisation from './Visualisation'
import { Background, Content, Overlay, Spacer, Wrapper } from './styled'

import overlayLeft from './images/display-left.png'
import overlayCenter from './images/display-center.png'

export default function Display({ status }: { status?: string }) {
  return (
    <Wrapper>
      <Background>
        <Overlay src={overlayLeft} />
        <Overlay src={overlayCenter} />
        <Overlay src={overlayLeft} />
      </Background>
      <Content>
        <Indicators />
        <Time />
        <Spacer />
        <Info />
        <Spacer />
        <Visualisation />
      </Content>
      <Ticker status={status} />
    </Wrapper>
  )
}
