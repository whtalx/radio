import React, { useEffect, useRef, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import Hls from 'hls.js'
import { StyledPlayer, Display, Title, Tick, Video, Controls, Time } from './styled'
import Visualization from '../Visualization'
import {
  Analyser,
  error,
  formatTime,
  makePlayerState,
} from '../../functions'

let timer
const context = new AudioContext()
const bands = Analyser({ node: context.createAnalyser(), smoothingTimeConstant: .7 })
const peaks = Analyser({ node: context.createAnalyser(), smoothingTimeConstant: .99 })

export default ({
  list,
  listToggle,
  updateStation,
  player,
  setState,
  setPlaying,
}) => {
  const hls = useRef(null)
  const node = useRef(null)
  const station = useRef(player.playing)
  const [time, setTime] = useState(null)
  const [title, setTitle] = useState(``)
  const [fullscreen, setFullscreen] = useState(false)
  const [sourceHeight, setSourceHeight] = useState(0)

  function stop() {
    ipcRenderer.send(`abort`)
    timer && clearInterval(timer)
    setTime(null)
    timer = null

    if (hls.current) {
      hls.current.destroy()
      hls.current = null
      sourceHeight && setSourceHeight(0)
    }

    node.current.src = ``
    title && setTitle(``)
  }

  function play() {
    node.current.play().catch((e) => {
      error(e)
      stop()
    })
  }

  function handleClick(button) {
    switch (button) {
      case `list`:
        return () => listToggle()

      case `play`:
        return () => {
          player.currentState === `paused` &&
          station.current.id &&
          (station.current.hls
            ? setPlaying({ ...station.current })
            : ipcRenderer.send(`request`, station.current))
        }

      case `stop`:
        return () => player.currentState !== `paused` && stop()

      default:
        return
    }
  }

  useEffect(
    () => {
      context.audioWorklet.addModule(`workers/worklet.js`).then(() => {
        const worklet = new AudioWorkletNode(context, `gain-processor`)
        worklet.port.onmessage = ({ data }) => console.log(data)
        context.createMediaElementSource(node.current).connect(worklet)
        worklet.connect(bands)
        worklet.connect(peaks)
        worklet.connect(context.destination)
      })

      node.current.autoplay = true
      node.current.addEventListener(`pause`, stop)
      node.current.addEventListener(`playing`, () => {
        setState(`playing`)
        setTime(0)
      })

      node.current.addEventListener(`loadstart`, ({ target: { src } }) =>
        setState(makePlayerState(src))
      )

      ipcRenderer.on(`served`, (_, port) =>
        node.current.src = `http://[::1]:${ port }`
      )

      ipcRenderer.on(`metadata`, (_, data = {}) =>
        setTitle(data.StreamTitle || ``)
      )

      ipcRenderer.on(`player`, (_, command) => {
        switch (command) {
          case `play`:
            return ipcRenderer.send(`request`, station.current)

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
      sourceHeight && setSourceHeight(0)
      hls.current && hls.current.destroy()
      timer && clearInterval(timer)
      setTime(null)
      setTitle(``)
      timer = null

      if (player.currentState !== `pending`) return
      station.current = player.playing
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
                updateStation({ ...player.playing, unresolvable: true })
                setPlaying({})
                break
              }
            }
          }
        })
      } else if (!current.id) {
        stop()
      }

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
          ? height + sourceHeight - 32
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

  useEffect(
    () => {
      if (!Number.isFinite(time)) return
      timer && clearInterval(timer)
      timer = setInterval(() => setTime(time + 1), 1000)
    },
    [time] // eslint-disable-line
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
            { title || player.playing.name }
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
        <button onClick={ handleClick(`list`) }>
          list
        </button>
        <button onClick={ handleClick(`play`) }>
          play
        </button>
        <button onClick={ handleClick(`stop`) }>
          stop
        </button>
      </Controls>
    </StyledPlayer>
  )
}
