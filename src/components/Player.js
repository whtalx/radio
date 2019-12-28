import React, { useEffect, useRef, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import Hls from 'hls.js'
import styled, { css } from 'styled-components'
import error from '../functions/error'
import Visualization from './Visualization'
import AnalyserNode from '../classes/AnalyserNode'

const StyledPlayer = styled.div`
  padding: 3px;
  width: 264px;
  height: 100%;
  min-height: 96px;
  display: flex;
  flex-flow: column;
  align-content: center;
  justify-content: flex-start;
`

const Video = styled.video`
  ${
    props => props.fullscreen
      ? css`
        position: absolute;
        width: 100vw;
        height: 100vh;
      `
      : css`
        margin: 0 auto;
        width: 244px;
        height: ${ props.sourceHeight || 8 }px;
        border-top-color: hsl(240, 100%, 3%);
        border-left-color: hsl(240, 100%, 3%);
        border-right-color: hsl(240, 18%, 27%);
        border-bottom-color: hsl(240, 18%, 27%);
        border-style: solid;
        border-width: 1px;
      `
  }
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
  const [state, setState] = useState(lastState)
  const [station, setStation] = useState(lastStation)
  const [sourceHeight, setSourceHeight] = useState(0)
  const [fullscreen, setFullscreen] = useState(remote.getCurrentWindow().isFullScreen())

  useEffect(
    () => {
      context.createMediaElementSource(node.current).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)

      node.current.addEventListener(`playing`, () => setState(`playing`))
      node.current.addEventListener(`loadstart`, () => setState(`loading`))
      node.current.addEventListener(`pause`, () => setState(`paused`))

      ipcRenderer.on(`station`, (e, data) => setStation(data))
      ipcRenderer.on(`fullscreen`, (e, data) => setFullscreen(data))

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
      [...node.current.childNodes].forEach(child => child.remove())
      sourceHeight && setSourceHeight(0)
      setLastStation(station)
      if (hls) hls.destroy()

      if (station.hls) {
        const h = new Hls()
        h.loadSource(station.hls)
        h.attachMedia(node.current)
        h.on(Hls.Events.MANIFEST_PARSED,() => node.current.play().catch(error))
        h.on(Hls.Events.BUFFER_CODECS,(e, { video }) => {
          if (!video) return

          const { width, height } = video.metadata
          if (!width || !height) return

          setSourceHeight(Math.floor(height * 244 / width))
        })

        h.on(Hls.Events.ERROR, (e, data) => {
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR: {
                console.log(`fatal network error encountered, try to recover`)
                h.startLoad()
                break
              }

              case Hls.ErrorTypes.MEDIA_ERROR: {
                console.log(`fatal media error encountered, try to recover`)
                h.recoverMediaError()
                break
              }

              default: {
                list.webContents.send(`unresolvable`, { ...station, unresolvable: true })
                setStation({})
                break
              }
            }
          }
        })

        setHls(h)
        return
      } else if (station.src_resolved) {
        const source = document.createElement(`SOURCE`)
        source.src = station.src_resolved
        node.current.appendChild(source)
        node.current.load()
        node.current.play().catch(error)
      }

      hls && setHls(null)
    }, // eslint-disable-next-line
    [station]
  )

  useEffect(
    () => {
      const rect = remote.getCurrentWindow().getBounds()
      remote.getCurrentWindow().setBounds({
        ...rect,
        height: 116 + sourceHeight,
      })
    }, // eslint-disable-next-line
    [sourceHeight]
  )

  return (
    <StyledPlayer>
      <Video
        ref={ node }
        crossOrigin={ `` }
        sourceHeight={ sourceHeight }
        fullscreen={ fullscreen }
        onDoubleClick={
          () => {
            if (!sourceHeight) return// && ipcRenderer.send(`toggle-fullscreen`)
            if (document.fullscreenElement) {
              document.exitFullscreen()
            } else {
              node.current.requestFullscreen()
            }
          }
        }
      />
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
