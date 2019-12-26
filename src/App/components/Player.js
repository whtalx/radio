import React, { useEffect, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import styled from 'styled-components'
import Visualization from './Visualization'
import error from '../functions/error'
import { connect } from "react-redux"

class audioNode {
  constructor() {
    const node = document.createElement(`AUDIO`)
    node.crossOrigin = ``
    node.preload = `none`
    node.onerror = error
    return node
  }
}

class bandsAnalyserNode {
  constructor(context) {
    const node = context.createAnalyser()
    node.fftSize = 2048
    node.minDecibels = -90
    node.maxDecibels = -20
    node.smoothingTimeConstant = .7
    return node
  }
}

class peaksAnalyserNode {
  constructor(context) {
    const node = context.createAnalyser()
    node.fftSize = 2048
    node.minDecibels = -90
    node.maxDecibels = -20
    node.smoothingTimeConstant = .99
    return node
  }
}

const StyledPlayer = styled.div`
  width: 264px;
  height: 96px;
  position: relative;
`

const Player = ({
  lastState,
  lastStation,
  setLastState,
  setLastStation,
}) => {
  const [audio] = useState(new audioNode())
  const [context] = useState(new AudioContext())
  const [bands] = useState(new bandsAnalyserNode(context))
  const [peaks] = useState(new peaksAnalyserNode(context))
  const [list, setList] = useState(remote.getGlobal(`list`))
  const [station, setStation] = useState(lastStation)
  const [state, setState] = useState(lastState)

  const play = (data) => {
    [...audio.childNodes].forEach(child => child.remove())

    if (data.src_resolved) {
      const source = document.createElement(`SOURCE`)
      source.src = data.src_resolved
      audio.appendChild(source)
      audio.load()
      audio.play().catch(error)
    } else {
      setState(`paused`)
    }
  }

  useEffect(
    () => {
      context.createMediaElementSource(audio).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)

      audio.addEventListener(`playing`, () => setState(`playing`))
      audio.addEventListener(`loadstart`, () => setState(`loading`))
      audio.addEventListener(`pause`, () => setState(`paused`))

      ipcRenderer.on(`station`, (event, data) => setStation(data))

      state === `playing` && play(station)
    }, // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (state === lastState) return
      if (!list) setList(remote.getGlobal(`list`))

      list.webContents.send(state, station)
      setLastState(state)
    }, // eslint-disable-next-line
    [state]
  )

  useEffect(
    () => {
      if (station.id === lastStation.id) return

      play(station)
      setLastStation(station)
    }, // eslint-disable-next-line
    [station]
  )

  return (
    <StyledPlayer>
      <button onClick={() => { ipcRenderer.send(`toggle-list`) }}>
        list
      </button>
      <button onClick={() => { audio.paused && station.src_resolved && play(station) }}>
        play
      </button>
      <button onClick={() => { !audio.paused && audio.pause() }}>
        stop
      </button>
      <Visualization
        state={ state }
        bandsBinCount={ bands.frequencyBinCount }
        peaksBinCount={ peaks.frequencyBinCount }
        bandsFrequencyData={ a => bands.getByteFrequencyData(a) }
        peaksFrequencyData={ a => peaks.getByteFrequencyData(a) }
      />
    </StyledPlayer>
  )
}

const mapStateToProps = ({ lastState, lastStation }) => ({ lastState, lastStation })
const mapDispatchToProps = (dispatch) => ({
  setLastState: payload => dispatch({ type: `SET_LAST_STATE`, payload }),
  setLastStation: payload => dispatch({ type: `SET_LAST_STATION`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
