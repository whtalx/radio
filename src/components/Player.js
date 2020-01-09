import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import Hls from 'hls.js'
import styled from 'styled-components'
import error from '../functions/error'
import Visualization from './Visualization'
import AnalyserNode from '../classes/AnalyserNode'
import { remote } from "electron"

const StyledPlayer = styled.div`
  width: 264px;
  position: relative;
  display: flex;
  flex-flow: column;
  align-content: center;
  justify-content: flex-start;
`

const Video = styled.video`
  margin: 0 auto;
  width: 244px;
  height: ${ props => props.sourceHeight || 8 }px;
  border-top-color: hsl(240, 100%, 3%);
  border-left-color: hsl(240, 100%, 3%);
  border-right-color: hsl(240, 18%, 27%);
  border-bottom-color: hsl(240, 18%, 27%);
  border-style: solid;
  border-width: 1px;

  :fullscreen {
    border: none;

    ::-webkit-media-controls {
      display:none !important;
    }
  }
`

const Controls = styled.div`
  height: 82px;
`

const Player = ({
  list,
  player,
  setPlaying,
  setStation,
  toggleList,
  setCurrentState,
}) => {
  const node = useRef(null)
  const [hls, setHls] = useState(null)
  const [context] = useState(new AudioContext())
  const [bands] = useState(new AnalyserNode({ context, stc: .7 }))
  const [peaks] = useState(new AnalyserNode({ context, stc: .99 }))
  const [sourceHeight, setSourceHeight] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(
    () => {
      context.createMediaElementSource(node.current).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)

      node.current.addEventListener(`playing`, () => setCurrentState(`playing`))
      node.current.addEventListener(`loadstart`, () => setCurrentState(`loading`))
      node.current.addEventListener(`pause`, () => setCurrentState(`paused`))

      return () => document.fullscreenElement && document.exitFullscreen()
    }, // eslint-disable-next-line
    []
  )


  useEffect(
    () => {
      // if (station.id === lastStation.id) return
      [...node.current.childNodes].forEach(child => child.remove())
      sourceHeight && setSourceHeight(0)
      // setLastStation(station)
      if (hls) hls.destroy()

      const station = player.playing
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
                console.log(`fatal network error encountered`, data)
                // h.startLoad()
                break
              }

              case Hls.ErrorTypes.MEDIA_ERROR: {
                console.log(`fatal media error encountered`, data)
                h.recoverMediaError()
                break
              }

              default: {
                setStation({ ...player.playing, unresolvable: true })
                setPlaying({})
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
      } else if (!station.id) {
        node.current.pause()
      }

      hls && setHls(null)
    }, // eslint-disable-next-line
    [player.playing]
  )

  useEffect(
    () => {
      const [width, height] = remote.getCurrentWindow().getContentSize()

      if (height < 200 && !sourceHeight) return

      remote.getCurrentWindow().setContentSize(
        width,
        sourceHeight
          ? height + sourceHeight - 8
          : 116 + (list.visible ? 500 : 0)
      )
    }, // eslint-disable-next-line
    [sourceHeight]
  )

  useEffect(
    () => {
      if (!sourceHeight) return

      document.fullscreenElement
        ? document.exitFullscreen()
        : node.current.requestFullscreen()
    }, // eslint-disable-next-line
    [fullscreen]
  )

  return (
    <StyledPlayer>
      <Video
        ref={ node }
        crossOrigin={ `` }
        sourceHeight={ sourceHeight }
        fullscreen={ fullscreen }
        onDoubleClick={ () => setFullscreen(last => !last) }
      />
      <Controls>
        <button onClick={ toggleList }>
          list
        </button>
        {/*<button>*/}
        {/*  play*/}
        {/*</button>*/}
        {/*<button onClick={() => { !node.paused && node.pause() }}>*/}
        {/*  stop*/}
        {/*</button>*/}
        <Visualization
          state={ player.currentState }
          bandsBinCount={ bands.frequencyBinCount }
          peaksBinCount={ peaks.frequencyBinCount }
          bandsFrequencyData={ a => bands.getByteFrequencyData(a) }
          peaksFrequencyData={ a => peaks.getByteFrequencyData(a) }
        />
      </Controls>
    </StyledPlayer>
  )
}

const mapStateToProps = ({ list, player }) => ({ list, player })
const mapDispatchToProps = (dispatch) => ({
  toggleList: () => dispatch({ type: `TOGGLE_LIST` }),
  setPlaying: payload => dispatch({ type: `SET_PLAYING`, payload }),
  setStation: payload => dispatch({ type: `SET_STATION`, payload }),
  setCurrentState: payload => dispatch({ type: `SET_CURRENT_STATE`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
