import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import Status from './status'
import Background from './background'
import { Wrapper, Counter, Visualisation} from './styled'
import { Analyser, Timer, visualize } from '../../functions'

function Display({ time, worklet, state }) {
  const animation = useRef(NaN)
  const timer = useRef(null)
  const bands = useRef(null)
  const peaks = useRef(null)
  const counter = useRef(null)
  const controller = useRef(false)
  const visualisation = useRef(null)
  const [poles] = useState([2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696])

  useEffect(
    () => {
      timer.current = Timer(counter.current)
      ipcRenderer.on(`visible`, start)
      ipcRenderer.on(`invisible`, stop)
    },
    [] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!worklet) return

      bands.current = Analyser({ node: worklet.context.createAnalyser(), smoothingTimeConstant: .7 })
      peaks.current = Analyser({ node: worklet.context.createAnalyser(), smoothingTimeConstant: .99 })
      worklet.connect(bands.current)
      worklet.connect(peaks.current)
      worklet.connect(worklet.context.destination)
    },
    [worklet]
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
      visualisation.current && start()
    },
    [controller.current] // eslint-disable-line
  )

  useEffect(
    () => {
      animation.current &&
      timer.current &&
      timer.current.tick(time)
    },
    [time]
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
    if (
      !animation.current ||
      !visualisation.current ||
      !bands.current ||
      !peaks.current
    ) return

    const bandsData = new Uint8Array(bands.current.frequencyBinCount)
    bands.current.getByteFrequencyData(bandsData)
    const peaksData = new Uint8Array(peaks.current.frequencyBinCount)
    peaks.current.getByteFrequencyData(peaksData)

    visualize({
      canvas: visualisation.current,
      bands: poles.map(i => bandsData[i]),
      peaks: poles.map(i => peaksData[i] + 15),
    })

    controller.current
      ? start()
      : peaksData.reduce((a, i) => a && !i, true)
        ? stop()
        : start()
  }

  return (
    <Wrapper>
      <Background>
      <Status />
      <g id="controls" fill="#333C49">
        <path id="O" d="M4 3H3V7H4V8H6V7H7V3H6V2H4V3ZM4 3V7H6V3H4Z" />
        <path id="A" d="M4 16V14H6V16H7V11H6V10H4V11H3V16H4ZM4 11V13H6V11H4Z" />
        <path id="I" d="M6 18H3V19H4V23H3V24H6V23H5V19H6V18Z" />
        <path id="D" d="M6 26H3V32H6V31H4V27H6V26ZM7 31V27H6V31H7Z" />
        <path id="V" d="M4 33H3V38H4V39H6V38H7V33H6V37H4V33Z" />
      </g>
      </Background>
      <Visualisation ref={ visualisation } />
      <Counter ref={ counter } />
    </Wrapper>
  )
}

const mapState = ({ player }) => ({ state: player.currentState })

export default connect(mapState)(Display)
