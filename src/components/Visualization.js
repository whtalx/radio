import React, { useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'
import { visualize } from '../functions'

const Canvas = styled.canvas`
  position: absolute;
  right: 2px;
  bottom: 3px;
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
  const status = useRef(state)
  const canvas = useRef(null)
  const controller = useRef(null)

  useEffect(
    () => {
      ipcRenderer.on(`visible`, () =>
        status.current === `playing` && (controller.current = new AbortController())
      )

      ipcRenderer.on(`invisible`, () =>
        controller.current && !controller.current.signal.aborted && controller.current.abort()
      )
    },
    [] // eslint-disable-line
  )

  useEffect(
    () => {
      status.current = state
      state === `playing`
        ? controller.current = new AbortController()
        : controller.current && controller.current.abort()
    },
    [state] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!controller.current) return

      controller.current.signal.addEventListener(`abort`, () => controller.current = null)

      const sendBands = () => {
        const { signal } = controller.current || {}
        if (!signal || signal.aborted || !canvas.current) return

        const bandsData = new Uint8Array(bandsBinCount)
        bandsFrequencyData(bandsData)
        const peaksData = new Uint8Array(peaksBinCount)
        peaksFrequencyData(peaksData)

        visualize({
          canvas: canvas.current,
          bands: bands.map(i => bandsData[i]),
          peaks: bands.map(i => peaksData[i]),
        })

        requestAnimationFrame(sendBands)
      }

      sendBands()
    },
    [controller.current] // eslint-disable-line
  )

  return <Canvas ref={ canvas } />
}
