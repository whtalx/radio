import React, { useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'
import Status from './status'
import { visualize } from '../../functions'

const Wrapper = styled.div`
  width: 93px;
  height: 42px;
  box-sizing: content-box;
  position: relative;
  left: 3px;
  top: 1px;
  border-width: 1px 0 0 1px;
  border-style: solid;
  border-color: hsl(240, 0%, 0%);
`

const Visualisation = styled.canvas`
  position: absolute;
  right: 1px;
  bottom: 8px;
  width: 79px;
  height: 19px;
`

const Background = styled.svg`
  box-shadow: 1px 1px 0 hsl(217, 22%, 63%);
`

const bands = [2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696]

export default function Display({
  time,
  state,
  bandsBinCount,
  peaksBinCount,
  bandsFrequencyData,
  peaksFrequencyData,
}) {
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

  return (
    <Wrapper>
      <Background width="92" height="41" viewBox="0 0 92 41" fill="none" fillRule="evenodd">
        <defs>
        <pattern id="dot" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="1" height="1" fill="#181829" />
        </pattern>
      </defs>
      <g id="bg">
        <rect width="92" height="41" fill="#000" />
        <rect width="92" height="41" fill="url(#dot)" />
        <path d="M11.5 19 V37.5 H90" stroke="#005284" strokeWidth="1" strokeDasharray="1 3" />
        <path d="M11.5 21 V37.5 H90" stroke="#639CF7" strokeWidth="1" strokeDasharray="1 3" />
      </g>
      <Status state={ state } />
      <g id="controls" fill="#333C49">
        <path id="O" d="M4 3H3V7H4V8H6V7H7V3H6V2H4V3ZM4 3V7H6V3H4Z" />
        <path id="A" d="M4 16V14H6V16H7V11H6V10H4V11H3V16H4ZM4 11V13H6V11H4Z" />
        <path id="I" d="M6 18H3V19H4V23H3V24H6V23H5V19H6V18Z" />
        <path id="D" d="M6 26H3 V32 H6 V31 H4 V27 H6 V26 Z M7 31 V27 H6 V31 H7 Z" />
        <path id="V" d="M4 33H3V38H4V39H6V38H7V33H6V37H4V33Z" />
      </g>
      </Background>
      <Visualisation ref={ canvas } />
    </Wrapper>
  )
}
