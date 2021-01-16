import React, { useContext } from 'react'

import { State } from '../../../../reducer'

import { Busy, Play, Stop, Wrapper } from './styled'

export default function Indicators() {
  const state = useContext(State)
  const { currentState } = state.player

  return (
    <Wrapper>
      <Play active={ currentState === `playing` } />
      <Stop active={ currentState === `stopped` } />
      <Busy active={ currentState === `busy` } />
    </Wrapper>
  )
}
