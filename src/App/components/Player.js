import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'
import Visualization from './Visualization'
import error from '../functions/error'

const audioNode = () => {
  const node = document.createElement(`AUDIO`)
  node.crossOrigin = ``
  node.preload = `all`
  node.onerror = error

  node.onabort = ({ target }) => {
    console.log(`aborted: `, target.src)
  }

  node.onloadstart = ({ target }) => {
    console.log(`loading: `, target.src)
  }

  node.onloadedmetadata = ({ target }) => {
    console.log(`playing: `, target.src)
  }

  node.oncanplay = () => {
    node.play().catch(error)
  }

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
`

const Player = ({ player }) => {
  const [context] = useState(new AudioContext())
  const [analyser] = useState(analyserNode(context))
  const [audio] = useState(audioNode())

  useEffect(
    () => {
      const source = context.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(context.destination)
    }, // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      audio.src = player.station.src_resolved || ``
      audio.load()
    }, // eslint-disable-next-line
    [player.station]
  )

  return (
    <Main>
      <button onClick={() => { ipcRenderer.send(`toggle-list`) }}>
        list
      </button>
      <Visualization analyser={ analyser } paused={ audio.paused } setVisualization={ (f) => { audio.onplaying = f } }/>
    </Main>
  )
}

const mapStateToProps = ({ player }) => ({ player })
const mapDispatchToProps = (dispatch) => ({
  init: payload => dispatch({ type: `INIT_PLAYER`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
