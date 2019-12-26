import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import visualize from '../functions/visualize'

const Canvas = styled.canvas`
  position: absolute;
  right: 15px;
  bottom: 15px;
  width: 79px;
  height: 19px;
`

export default ({
  state,
  bandsBinCount,
  peaksBinCount,
  bandsFrequencyData,
  peaksFrequencyData,
}) => {
  const canvasRef = useRef(null)
  const [controller, setController] = useState(null)
  const [bands] = useState([2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696])

  useEffect(
    () => {
      state === `playing`
        ? setController(new AbortController())
        : controller && controller.abort()
    }, // eslint-disable-next-line
    [state]
  )

  useEffect(
    () => {
      if (!controller) return

      const signal = controller.signal
      signal.addEventListener(`abort`, () => setController(null))

      const sendBands = () => {
        if (signal.aborted) return

        const bandsData = new Uint8Array(bandsBinCount)
        bandsFrequencyData(bandsData)
        const peaksData = new Uint8Array(peaksBinCount)
        peaksFrequencyData(peaksData)

        visualize({
          canvas: canvasRef.current,
          bands: bands.map(i => bandsData[i]),
          peaks: bands.map(i => peaksData[i]),
        })

        requestAnimationFrame(sendBands)
      }

      sendBands()
    }, // eslint-disable-next-line
    [controller]
  )

  return <Canvas ref={ canvasRef } />
}
