import React, { useEffect, useRef } from 'react'

import { Canvas, Wrapper } from './styled'

import Spectrum from './Spectrum'
import { WIDTH, HEIGHT } from './constants'

function getFrequencyData() {
  return Array(18).fill().map(() => Math.random())
}

export default function Visualisation({ state }) {
  const canvas = useRef(null)
  const intervalId = useRef(NaN)
  const spectrum = useRef(null)
  const width = WIDTH * devicePixelRatio
  const height = HEIGHT * devicePixelRatio

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

      if (state === `playing`) {
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
    [state]
  )

  return (
    <Wrapper>
      <Canvas ref={ canvas } width={ width } height={ height } />
    </Wrapper>
  )
}
