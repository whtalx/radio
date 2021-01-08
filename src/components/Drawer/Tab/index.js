import React from 'react'

import { Background, Content, Wrapper } from './styled'

import activeLeft from './images/active-left.png'
import inactiveLeft from './images/inactive-left.png'
import activeCenter from './images/active-center.png'
import inactiveCenter from './images/inactive-center.png'
import activeRight from './images/active-right.png'
import inactiveRight from './images/inactive-right.png'

function Pad(props) {
  return <Background relative width="14px" height="100%" { ...props } />
}

export default function Tab({ active, children, onClick }) {
  return (
    <Wrapper onClick={ onClick }>
      <Pad src={ active ? activeLeft : inactiveLeft } />
      <div>
        <Background src={ active ? activeCenter : inactiveCenter } />
        <Content>{ children }</Content>
      </div>
      <Pad src={ active ? activeRight : inactiveRight } />
    </Wrapper>
  )
}
