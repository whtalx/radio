import React, { useContext, useEffect, useRef } from 'react'

import { Canvas } from './styled'

import Timer, { TimerInterface } from './Timer'
import { StateContext } from '../../../../store'
import { WIDTH, HEIGHT } from './constants'

import time from './images/time.png'

export default function Time() {
  const state = useContext(StateContext)
  const timer = useRef<TimerInterface | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const intervalId = useRef(NaN)
  const sprite = useRef(new Image())
  const { currentState } = state.player
  const width = WIDTH * devicePixelRatio
  const height = HEIGHT * devicePixelRatio

  function tick() {
    if (!timer.current) return

    const date = new Date()
    const seconds = date.getSeconds() + date.getMinutes() * 60
    timer.current.render(seconds)
  }

  function clearIntervalId() {
    if (!intervalId.current) return

    clearInterval(intervalId.current)
    intervalId.current = NaN
  }

  function onLoad() {
    timer?.current?.empty()
  }

  useEffect(
    () => {
      sprite.current.onload = onLoad
      sprite.current.src = time
    },
    []
  )

  useEffect(
    () => {
      clearIntervalId()

      if (!canvas.current || !sprite.current) return

      timer.current = Timer(canvas.current, sprite.current)
    },
    [canvas]
  )

  useEffect(
    () => {
      if (!timer.current) return

      if (currentState === `playing`) {
        tick()
        intervalId.current = window.setInterval(tick, 1000)
      } else {
        clearIntervalId()
        timer.current.empty()
      }


      return () => {
        clearIntervalId()
      }
    },
    [currentState]
  )

  return (
    <Canvas ref={canvas} width={width} height={height} />
  )
}
