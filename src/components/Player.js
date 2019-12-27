import React, { useEffect, useRef, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import Hls from 'hls.js'
import styled from 'styled-components'
import error from '../functions/error'
import Visualization from './Visualization'
import AnalyserNode from '../classes/AnalyserNode'

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
  const node = useRef(null)
  const [hls, setHls] = useState(null)
  const [context] = useState(new AudioContext())
  const [bands] = useState(new AnalyserNode({ context, stc: .7 }))
  const [peaks] = useState(new AnalyserNode({ context, stc: .99 }))
  const [list, setList] = useState(remote.getGlobal(`list`))
  const [station, setStation] = useState(lastStation)
  const [state, setState] = useState(lastState)

  useEffect(
    () => {
      context.createMediaElementSource(node.current).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)

      node.current.addEventListener(`playing`, ({ target }) => {
        setState(`playing`)
        console.dir(target)
      })
      node.current.addEventListener(`loadstart`, () => setState(`loading`))
      node.current.addEventListener(`pause`, () => setState(`paused`))

      ipcRenderer.on(`station`, (e, data) => setStation(data))

      // state === `playing` && play(station)
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
      // if (station.id === lastStation.id) return
      setLastStation(station)

        if (hls) { hls.destroy() }

        [...node.current.childNodes].forEach(child => child.remove())

        if (station.hls) {
          const h = new Hls()
          h.loadSource(station.hls)
          h.attachMedia(node.current)
          h.on(Hls.Events.MANIFEST_PARSED,()  => node.current.play())
          h.on(Hls.Events.ERROR, (e, data) => {
            error(data)
            list.webContents.send(`unresolvable`, { ...station, unresolvable: true })
            setStation({})
          })
          setHls(h)
        } else if (station.src_resolved) {
          const source = document.createElement(`SOURCE`)
          source.src = station.src_resolved
          node.current.appendChild(source)
          node.current.load()
          node.current.play().catch(error)
          setHls(null)
        } else {
          setState(`paused`)
          setHls(null)
        }
    }, // eslint-disable-next-line
    [station]
  )

  return (
    <StyledPlayer>
      <video ref={ node } crossOrigin={ `` } width={ `160px` } height={ `90px` }/>
      <button onClick={() => { ipcRenderer.send(`toggle-list`) }}>
        list
      </button>
      {/*<button>*/}
      {/*  play*/}
      {/*</button>*/}
      {/*<button onClick={() => { !node.paused && node.pause() }}>*/}
      {/*  stop*/}
      {/*</button>*/}
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
