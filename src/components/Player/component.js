import React, { useEffect, useRef, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import Hls from 'hls.js'
import { StyledPlayer, Display, Title, Tick, Video, Controls, Time } from './styled'
import Visualization from '../Visualization'
import AnalyserNode from '../../classes/AnalyserNode'
import error from '../../functions/error'
import formatTime from '../../functions/formatTime'
import makePlayerState from '../../functions/makePlayerState'

const timer = new Worker(`./workers/timer.js`)
const streamer = new Worker(`./workers/streamer.js`)
const context = new AudioContext()
const bands = new AnalyserNode({ context, stc: .7 })
const peaks = new AnalyserNode({ context, stc: .99 })

export default ({
  list,
  listToggle,
  setStation,
  player,
  setState,
  setPlaying,
}) => {
  const hls = useRef(null)
  const node = useRef(null)
  const station = useRef(player.playing)
  const mediaSource = useRef(null)
  const sourceBuffer = useRef(null)
  const [time, setTime] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [sourceHeight, setSourceHeight] = useState(0)

  const stop = () => {
    timer.postMessage({ type: `stop` })
    streamer.postMessage({ type: `stop` })
    mediaSource.current && (mediaSource.current = null)
    sourceBuffer.current && (sourceBuffer.current = null)

    if (hls.current) {
      hls.current.destroy()
      hls.current = null
      sourceHeight && setSourceHeight(0)
    }

    node.current.src = ``
  }

  const play = () => {
    node.current.play().catch((e) => {
      error(e)
      stop()
    })
  }

  useEffect(
    () => {
      context.createMediaElementSource(node.current).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)

      node.current.autoplay = true
      node.current.addEventListener(`pause`, stop)
      node.current.addEventListener(`playing`, () => {
        setState(`playing`)
        timer.postMessage({ type: `start` })
      })

      node.current.addEventListener(`loadstart`, ({ target: { src } }) =>
        setState(makePlayerState(src))
      )

      timer.onmessage = ({ data }) => {
        setTime(data || Math.floor(node.current.currentTime))
      }

      streamer.onmessage = ({ data: { type, payload }}) => {
        switch (type) {
          case `mime`: {
            if (!mediaSource.current) return

            sourceBuffer.current = mediaSource.current.addSourceBuffer(payload)
            sourceBuffer.current.onupdateend = () =>
              streamer.postMessage({ type: `ready` })

            streamer.postMessage({ type: `ready` })
            return
          }

          case `buffer`: {
            sourceBuffer.current && sourceBuffer.current.appendBuffer(payload)
            return
          }

          case `error`: {
            error(payload)
            return
          }

          default:
            return
        }
      }

      ipcRenderer.on(`visible`, () =>
        !node.current.paused && timer.postMessage({ type: `continue` })
      )

      ipcRenderer.on(`invisible`, () =>
        !node.current.paused && timer.postMessage({ type: `pause` })
      )

      ipcRenderer.on(`player`, (_, data) => {
        switch (data) {
          case `play`:
            return setPlaying(station.current)

          case `stop`:
            return stop()

          default:
            return
        }
      })
    },
    [] // eslint-disable-line
  )

  useEffect(
    () => {
      timer.postMessage({ type: `stop` })
      streamer.postMessage({ type: `stop` })
      hls.current && hls.current.destroy()
      sourceHeight && setSourceHeight(0)
      mediaSource.current && (mediaSource.current = null)
      sourceBuffer.current && (sourceBuffer.current = null)

      if (player.currentState !== `pending`) return

      const { current } = station

      if (current.hls) {
        hls.current = new Hls({
          liveDurationInfinity: true,
          fetchSetup: (context, initParams) => {
            initParams.mode = `cors`
            initParams.credentials = `omit`
            initParams.referrer = ``
            return new Request(context.url, initParams)
          }
        })
        hls.current.loadSource(current.hls)
        hls.current.attachMedia(node.current)
        hls.current.on(Hls.Events.MANIFEST_PARSED, play)
        hls.current.on(Hls.Events.BUFFER_CODECS,(e, { video }) => {
          if (!video) return

          const { width, height } = video.metadata
          if (!width || !height) return

          setSourceHeight(Math.floor(height * 244 / width))
        })

        hls.current.on(Hls.Events.ERROR, (e, data) => {
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR: {
                console.log(`fatal network error encountered`, data)
                // hls.current.startLoad()
                break
              }

              case Hls.ErrorTypes.MEDIA_ERROR: {
                console.log(`fatal media error encountered`, data)
                hls.current.recoverMediaError()
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
        return
      } else if (current.src_resolved) {
        mediaSource.current = new MediaSource()
        node.current.src = URL.createObjectURL(mediaSource.current)
        mediaSource.current.addEventListener('sourceopen', () => {
          streamer.postMessage({ type: `start`, payload: current.src_resolved })
        })
      } else if (!current.id) {
        stop()
      }

      hls.current && (hls.current = null)
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
          : 116 + (list.visible ? 509 : 0)
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
          <Time>{ formatTime(time) }</Time>
          <Visualization
            state={ player.currentState }
            bandsBinCount={ bands.frequencyBinCount }
            peaksBinCount={ peaks.frequencyBinCount }
            bandsFrequencyData={ a => bands.getByteFrequencyData(a) }
            peaksFrequencyData={ a => peaks.getByteFrequencyData(a) }
          />
        </Display>
        <Title>
          <Tick>
            { player.playing.title || player.playing.name }
          </Tick>
        </Title>
      </section>
      <Video
        ref={ node }
        sourceHeight={ sourceHeight }
        fullscreen={ fullscreen }
        onDoubleClick={ () => setFullscreen(last => !last) }
      />
      <Controls>
        <button onClick={ () => listToggle() }>
          list
        </button>
        <button onClick={() => { player.currentState === `paused` && station.current.id && setPlaying({ ...station.current }) }}>
          play
        </button>
        <button onClick={() => { player.currentState !== `paused` && stop() }}>
          stop
        </button>
      </Controls>
    </StyledPlayer>
  )
}
