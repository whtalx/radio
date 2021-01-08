import React from 'react'

import { Busy, Play, Stop, Wrapper } from './styled'

export default function State({ state }) {
  return (
    <Wrapper>
      <Play active={ state === `playing` } />
      <Stop active={ state === `stopped` } />
      <Busy active={ state === `busy` } />
    </Wrapper>
  )
}

