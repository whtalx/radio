import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Canvas = styled.canvas`
  position: fixed;
  right: 15px;
  bottom: 15px;
  width: 79px;
  height: 19px;
`

const bands = [2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696]

export default ({
  paused,
  analyser,
  setVisualization,
}) => {
  const spectrum = useRef(null)

  const visualize = () => {
    const canvas = spectrum.current
    const ctx = canvas.getContext(`2d`)
    const { width, height } = canvas

    const clear = () => {
      ctx.fillStyle = `hsl(0, 0%, 0%)`
      ctx.fillRect(0, 0, width, height);

      [...Array(19).keys()].forEach((y) => {
        [...Array(79).keys()].forEach((x) => {
          if (x % 2 === 0 && y % 2 === 0) {
            ctx.fillStyle = x === 0
              ? y % 4 === 0
                ? `hsl(216, 60%, 81%)`
                : `hsl(205, 100%, 71%)`
              : y === 18
                ? x % 4 === 0
                  ? `hsl(216, 60%, 81%)`
                  : `hsl(205, 100%, 71%)`
                : `hsl(240, 41%, 16%)`

            ctx.fillRect(x * width / 79, y * height / 19, width / 79, height / 19)
          }
        })
      })
    }

    clear()

    if (!paused) return

    const gradient = ctx.createLinearGradient(0, 0, 0, height / 19 * 16)

    gradient.addColorStop(0, `hsl(0, 100%, 50%)`)
    gradient.addColorStop(.25, `hsl(30, 100%, 50%)`)
    gradient.addColorStop(.5, `hsl(60, 100%, 50%)`)
    gradient.addColorStop(.75, `hsl(90, 100%, 50%)`)
    gradient.addColorStop(1, `hsl(120, 100%, 50%)`)

    const drawBar = (x, w, amp) => {
      ctx.strokeStyle = gradient//`hsl(${ 100 - 100 / 16 * amp }, 100%, 50%)`
      ctx.lineWidth = w
      ctx.beginPath()
      ctx.moveTo(x + (width / 39.5), height - height / 19 * 2)
      ctx.lineTo(x + (width / 39.5), height / 19 * (16 - amp))
      ctx.stroke()
    }

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    bands.forEach((band, i) => {
      const x = i === 0
        ? 2 * width / 79
        : (((i - 1) * 4) + 6) * width / 79
      const amp = Math.floor(16 / 255 * dataArray[band])

      drawBar(x, width / 79 * 3, amp)
    })

    requestAnimationFrame(visualize)
  }

  useEffect(
    () => {
      if (!spectrum.current) return
      setVisualization(visualize)
      visualize()
    },// eslint-disable-next-line
    []
  )

  return (
    <Canvas ref={ spectrum } />
  )
}
