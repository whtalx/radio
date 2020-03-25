import React, { useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import Status from './status'
import Background from './background'
import { Wrapper, Counter, Visualisation} from './styled'
import { Analyser, Timer, visualize } from '../../functions'

const context = new AudioContext()
const bands = Analyser({ node: context.createAnalyser(), smoothingTimeConstant: .7 })
const peaks = Analyser({ node: context.createAnalyser(), smoothingTimeConstant: .99 })
const poles = [2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696]

function Display({ time, node, state }) {
  const animation = useRef(NaN)
  const timer = useRef(null)
  const counter = useRef(null)
  const controller = useRef(false)
  const visualisation = useRef(null)

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
      if (!node) return

      context.audioWorklet.addModule(`workers/worklet.js`).then(() => {
        const worklet = new AudioWorkletNode(context, `gain-processor`)
        worklet.port.onmessage = ({ data }) => console.log(data)
        context.createMediaElementSource(node).connect(worklet)
        worklet.connect(bands)
        worklet.connect(peaks)
        worklet.connect(context.destination)
      })
    },
    [node]
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
    if (!animation.current || !visualisation.current) return

    const bandsData = new Uint8Array(bands.frequencyBinCount)
    bands.getByteFrequencyData(bandsData)
    const peaksData = new Uint8Array(peaks.frequencyBinCount)
    peaks.getByteFrequencyData(peaksData)

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
