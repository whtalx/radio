import React, { useContext } from 'react'

import { StateContext } from '../../../../store'

import { Busy, Play, Stop, Wrapper } from './styled'

export default function Indicators() {
  const state = useContext(StateContext)
  const { currentState } = state.player

  return (
    <Wrapper>
      <Play active={ currentState === `playing` } />
      <Stop active={ currentState === `stopped` } />
      <Busy active={ currentState === `busy` } />
    </Wrapper>
  )
}
