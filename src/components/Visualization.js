import React, { useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'
import { visualize } from '../functions'

const Canvas = styled.canvas`
  position: absolute;
  right: 1px;
  bottom: 8px;
  width: 79px;
  height: 19px;
`

const bands = [2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696]

export default ({
  state,
  bandsBinCount,
  peaksBinCount,
  bandsFrequencyData,
  peaksFrequencyData,
}) => {
  const canvas = useRef(null)
  const animation = useRef(NaN)
  const controller = useRef(false)

  useEffect(
    () => {
      ipcRenderer.on(`visible`, start)
      ipcRenderer.on(`invisible`, stop)
    },
    [] // eslint-disable-line
  )

  useEffect(
    () => {
      state === `playing`
        ? controller.current = true
        : controller.current && (controller.current = false)
    },
    [state] // eslint-disable-line
  )

  useEffect(
    () => {
      canvas.current && start()
    },
    [controller.current] // eslint-disable-line
  )

  function start() {
    cancelAnimationFrame(animation.current)
    animation.current = requestAnimationFrame(frame)
  }

  function stop() {
    cancelAnimationFrame(animation.current)
    animation.current = NaN
  }

  function frame() {
    if (!animation.current || !canvas.current) return
    const bandsData = new Uint8Array(bandsBinCount)
    bandsFrequencyData(bandsData)
    const peaksData = new Uint8Array(peaksBinCount)
    peaksFrequencyData(peaksData)

    visualize({
      canvas: canvas.current,
      bands: bands.map(i => bandsData[i]),
      peaks: bands.map(i => peaksData[i]),
    })

    controller.current
      ? start()
      : peaksData.reduce((a, i) => a && !i, true)
        ? stop()
        : start()
  }

  return <Canvas ref={ canvas } />
}
