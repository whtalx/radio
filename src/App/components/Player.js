import React, { useEffect, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import styled from 'styled-components'
import Visualization from './Visualization'
import error from '../functions/error'

const audioNode = () => {
  const node = document.createElement(`AUDIO`)
  node.crossOrigin = ``
  node.preload = `none`
  node.onerror = error
  return node
}

const analyserNode = (context) => {
  const node = context.createAnalyser()
  node.fftSize = 2048
  node.minDecibels = -90
  node.maxDecibels = -20
  node.smoothingTimeConstant = .88
  return node
}

const Main = styled.div`
  width: 275px;
  height: 116px;
  box-sizing: border-box;
  background-image: linear-gradient(to right bottom, hsl(240, 52%, 13%) 0%, hsl(240, 41%, 16%) 15%, hsl(240, 38%, 26%) 35%, hsl(240, 30%, 32%) 50%, hsl(240, 34%, 29%) 75%, hsl(240, 33%, 9%) 100%);
  border: 1px solid black;
  box-shadow:
    inset 1px 1px 2px hsl(199, 22%, 45%);
  -webkit-app-region: drag;

  button {
  -webkit-app-region: no-drag;
  }
`

export default () => {
  const [context] = useState(new AudioContext())
  const [analyser] = useState(analyserNode(context))
  const [audio] = useState(audioNode())
  const [list, setList] = useState(remote.getGlobal(`list`))
  const [current, setCurrent] = useState({})
  const [state, setState] = useState(`paused`)

  const play = () => {
    audio.load()
    audio.play().catch(error)
  }

  const setStation = (src = ``) => {
    const children = [...audio.childNodes]
    children.forEach(child => child.remove())

    if (src) {
      const source = document.createElement(`SOURCE`)
      source.src = src
      audio.appendChild(source)
    } else {
      setState(`paused`)
    }

    play()
  }

  useEffect(
    () => {
      const source = context.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(context.destination)
      audio.addEventListener(`playing`, () => {
        setState(`playing`)
      })
      audio.addEventListener(`loadstart`, () => {
        setState(`loading`)
      })
      audio.addEventListener(`pause`, () => {
        setState(`paused`)
      })

      ipcRenderer.on(`station`, (event, station) => {
        setStation(station.src_resolved)
        setCurrent(station)
      })
    }, // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (!list) setList(remote.getGlobal(`list`))

      list.webContents.send(state, current)
    }, // eslint-disable-next-line
    [state]
  )

  return (
    <Main>
      <button onClick={() => { ipcRenderer.send(`toggle-list`) }}>
        list
      </button>
      <button onClick={() => { audio.paused && audio.children.length > 0 && play() }}>
        play
      </button>
      <button onClick={() => { !audio.paused && audio.pause() }}>
        stop
      </button>
      <Visualization analyser={ analyser } paused={ audio.paused } setVisualization={ (f) => { audio.addEventListener(`playing`, f) }} />
    </Main>
  )
}
