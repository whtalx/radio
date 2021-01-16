import React, { useContext, useEffect, useRef } from 'react'

import { Canvas, Wrapper } from './styled'

import Spectrum from './Spectrum'
import { State } from '../../../../reducer'
import { WIDTH, HEIGHT } from './constants'

function getFrequencyData() {
  return Array(18).fill().map(() => Math.random())
}

export default function Visualisation() {
  const canvas = useRef(null)
  const spectrum = useRef(null)
  const intervalId = useRef(NaN)
  const state = useContext(State)
  const width = WIDTH * devicePixelRatio
  const height = HEIGHT * devicePixelRatio
  const { currentState } = state.player

  function tick() {
    if (!spectrum.current) return

    const bands = getFrequencyData()
    spectrum.current.render(bands)
  }

  function clearIntervalId() {
    if (!intervalId.current) return

    clearInterval(intervalId.current)
    intervalId.current = NaN
  }

  useEffect(
    () => {
      clearIntervalId()

      if (!canvas.current) return

      spectrum.current = Spectrum(canvas.current)
    },
    [canvas]
  )

  useEffect(
    () => {
      if (!spectrum.current) return

      if (currentState === `playing`) {
        tick()
        intervalId.current = setInterval(tick, 1000)
      } else {
        clearIntervalId()
        spectrum.current.stop()
      }

      return () => {
        clearIntervalId()
      }
    },
    [currentState]
  )

  return (
    <Wrapper>
      <Canvas ref={ canvas } width={ width } height={ height } />
    </Wrapper>
  )
}
