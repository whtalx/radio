import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer, remote } from 'electron'
import Hls from 'hls.js'
import styled from 'styled-components'
import error from '../functions/error'
import Visualization from './Visualization'
import AnalyserNode from '../classes/AnalyserNode'
import { setPlayer, setPlaying, playerSetState } from '../reducers/player'
import { listToggle, setStation } from '../reducers/list'

const StyledPlayer = styled.div`
  width: 264px;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-content: center;
  justify-content: flex-start;

  section {
    display: flex;
  }
`

const Display = styled.div`
  width: 92px;
  height: 44px;
  position: relative;
`

const Title = styled.div`
  width: calc(100% - 100px);
  height: 1.1em;
  font-size: 1em;
  line-height: 1.1em;
  background-color: hsl(0, 0%, 0%);
  color: hsl(120, 100%, 50%);
  overflow: hidden;
  white-space: nowrap;
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
      display: none !important;
    }
  }
`

const Controls = styled.div`
  height: 82px;
`

const Player = ({
  list,
  player,
  setPlayer,
  listToggle,
  setPlaying,
  setStation,
  playerSetState,
}) => {
  const node = useRef(null)
  const [hls, setHls] = useState(null)
  const [context] = useState(new AudioContext())
  const [bands] = useState(new AnalyserNode({ context, stc: .7 }))
  const [peaks] = useState(new AnalyserNode({ context, stc: .99 }))
  const [sourceHeight, setSourceHeight] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const play = () => {
    node.current.play().catch((e) => {
      playerSetState(`paused`)
      error(e)
    })
  }

  const stop = () => {
    playerSetState(`paused`)

    if (hls) {
      hls.destroy()
      setHls(null)
    }

    node.current.pause()
  }

  useEffect(
    () => {
      const string = localStorage.getItem(`player`)
      string && setPlayer(JSON.parse(string))

      context.createMediaElementSource(node.current).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)

      node.current.addEventListener(`playing`, () => playerSetState(`playing`))
      node.current.addEventListener(`loadstart`, () => {
        playerSetState(/(file|localhost):/.test(node.current.src) ? `paused` : `loading`)
      })

      node.current.addEventListener(`pause`, () => {
        node.current.src = ``
      })

      ipcRenderer.on(`resolved`, (_, data) => {
        setPlaying(data)
      })
    },
    [] // eslint-disable-line
  )

  useEffect(
    () => {
      const string = JSON.stringify(player)
      const storage = localStorage.getItem(`player`)
      string !== storage && localStorage.setItem(`player`, string)
    },
    [player] // eslint-disable-line
  )

  useEffect(
    () => {
      [...node.current.childNodes].forEach(child => child.remove())
      sourceHeight && setSourceHeight(0)
      if (hls) hls.destroy()

      const station = player.playing
      if (station.hls) {
        const h = new Hls()
        h.loadSource(station.hls)
        h.attachMedia(node.current)
        h.on(Hls.Events.MANIFEST_PARSED, play)
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
        node.current.src = station.src_resolved
        play()
      } else if (!station.id) {
        stop()
      }

      hls && setHls(null)
    },
    [player.playing] // eslint-disable-line
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
    },
    [sourceHeight] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!sourceHeight) return

      document.fullscreenElement
        ? document.exitFullscreen()
        : node.current.requestFullscreen()
    },
    [fullscreen] // eslint-disable-line
  )

  return (
    <StyledPlayer>
      <section>
        <Display>
          <Visualization
            state={ player.currentState }
            bandsBinCount={ bands.frequencyBinCount }
            peaksBinCount={ peaks.frequencyBinCount }
            bandsFrequencyData={ a => bands.getByteFrequencyData(a) }
            peaksFrequencyData={ a => peaks.getByteFrequencyData(a) }
          />
        </Display>
        <Title>
          { player.playing.title || player.playing.name }
        </Title>
      </section>
      <Video
        ref={ node }
        crossOrigin={ `` }
        sourceHeight={ sourceHeight }
        fullscreen={ fullscreen }
        onDoubleClick={ () => setFullscreen(last => !last) }
      />
      <Controls>
        <button onClick={ () => listToggle() }>
          list
        </button>
        <button onClick={() => { player.currentState === `paused` && player.playing.id && setPlaying({ ...player.playing }) }}>
          play
        </button>
        <button onClick={() => { player.currentState !== `paused` && stop() }}>
          stop
        </button>
      </Controls>
    </StyledPlayer>
  )
}

const mapState = ({ list, player }) => ({ list, player })
const mapDispatch = {
  setPlayer,
  listToggle,
  setPlaying,
  setStation,
  playerSetState,
}

export default connect(mapState, mapDispatch)(Player)
