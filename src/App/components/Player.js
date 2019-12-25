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
  padding: 3px;
  width: 275px;
  height: 116px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  background-image:
    linear-gradient(
      315deg,
      hsl(240, 33%, 9%) 0%,
      hsl(240, 31%, 16%) 5%,
      hsl(240, 32%, 20%) 10%,
      hsl(240, 20%, 28%) 40%,
      hsl(240, 20%, 28%) 60%,
      hsl(240, 32%, 20%) 90%,
      hsl(240, 31%, 16%) 95%,
      hsl(240, 33%, 9%) 100%
    );
  border: 1px solid black;
  box-shadow:
    inset 1px 1px 2px hsl(200, 20%, 80%);
`

const Title = styled.div`
  height: 9px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-app-region: drag;

  button {
    margin-left: 3px;
    padding: 0;
    width: 9px;
    height: 9px;
    -webkit-app-region: no-drag;
  }
`

const Content = styled.div`
  flex: 0 1 100%;
  height: auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: hsl(240, 100%, 3%);
  border-style: solid;
  border-width: 2px 1px 1px 2px;
  box-shadow:
    inset 1px 1px 2px hsl(200, 20%, 80%),
    1px 1px 2px hsl(200, 20%, 80%);
  
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
      <Title>
        <button onClick={() => { ipcRenderer.send(`hide`) }} title={ `hide` } />
        <button onClick={() => { ipcRenderer.send(`close`) }} title={ `close` } />
      </Title>
      <Content>
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
      </Content>
    </Main>
  )
}
