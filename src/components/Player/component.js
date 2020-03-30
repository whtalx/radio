import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import Hls from 'hls.js'
import { StyledPlayer, Top, Video, Controls } from './styled'
import { Playlist, Equaliser } from './switches'
import Samplerate from './samplerate'
import Channels from './channels'
import Display from '../Display'
import Bitrate from './bitrate'
import Volume from './volume'
import Title from './title'
import Pan from './pan'
import { error, makePlayerState } from '../../functions'

export default ({
  list,
  updateStation,
  player,
  setState,
  setPlaying,
}) => {
  const timer = useRef(NaN)
  const hls = useRef(null)
  const pan = useRef(null)
  const node = useRef(null)
  const gain = useRef(null)
  const station = useRef(player.playing)
  const worklet = useRef(null)
  const listVisible = useRef(list.visible)
  const sourceHeight = useRef(0)
  const [time, setTime] = useState(null)
  const [title, setTitle] = useState(``)
  const [optionChanged, setOptionChanged] = useState(``)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(
    () => {
      const { webAudio } = window
      gain.current = webAudio.createGain()
      pan.current = webAudio.createStereoPanner()
      webAudio.createMediaElementSource(node.current).connect(gain.current)
      gain.current.connect(pan.current)
      pan.current.pan.value = player.pan / 100
      gain.current.gain.value = player.volume / 100
      webAudio.audioWorklet.addModule(`workers/worklet.js`).then(() => {
        worklet.current = new AudioWorkletNode(webAudio, `gain-processor`)
        worklet.current.port.onmessage = ({ data }) => console.log(data)
        pan.current.connect(worklet.current)
      })

      node.current.autoplay = true
      node.current.addEventListener(`pause`, stop)
      node.current.addEventListener(`playing`, () => {
        setState(`playing`)
        startTimer()
      })

      node.current.addEventListener(`loadstart`, ({ target: { src } }) =>
        setState(makePlayerState(src))
      )

      ipcRenderer.on(`visible`, () =>
        timer.current && startTimer()
      )

      ipcRenderer.on(`invisible`, () =>
        timer.current && clearInterval(timer.current)
      )

      ipcRenderer.on(`served`, (_, port) =>
        node.current.src = `http://[::1]:${ port }`
      )

      ipcRenderer.on(`metadata`, (_, data = {}) =>
        setTitle(data.StreamTitle || ``)
      )

      ipcRenderer.on('sizeVideo', (e, [width, height]) =>
          ipcRenderer.send(`setSize`, [
            width,
            sourceHeight.current
              ? height + sourceHeight.current - 32
              : 116 + (listVisible.current ? 509 : 0)
          ])
      )

      ipcRenderer.on(`pong`, (_, command) => {
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
      sourceHeight.current !== 0 && (sourceHeight.current = 0)
      hls.current && hls.current.destroy()
      setTitle(``)
      stopTimer()

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

          sourceHeight.current = Math.floor(height * 244 / width)
        })

        hls.current.on(Hls.Events.ERROR, (e, data) => {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR: {
                console.log(`network error encountered`, data)
                const { code } = data.response || {}
                if (!code || code === 404 || code === 403) {
                  unresolvable(player.playing)
                }
                // hls.current.startLoad()
                break
              }

              case Hls.ErrorTypes.MEDIA_ERROR: {
                console.log(`media error encountered`, data)
                hls.current.recoverMediaError()
                break
              }

              default: {
                console.log(`unknown error encountered`, data)
                unresolvable(player.playing)
                break
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
      ipcRenderer.send(`getSizeVideo`)
    },
    [sourceHeight.current] // eslint-disable-line
  )

  useEffect(
    () => {
      if (sourceHeight.current === 0) return

      document.fullscreenElement
        ? document.exitFullscreen()
        : node.current.requestFullscreen()
    },
    [fullscreen] // eslint-disable-line
  )

  useEffect(
    () => {
      listVisible.current = list.visible
    },
    [list.visible]
  )

  function stop() {
    ipcRenderer.send(`abort`)
    stopTimer()

    if (hls.current) {
      hls.current.destroy()
      hls.current = null
      sourceHeight.current !== 0 && (sourceHeight.current = 0)
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

  function unresolvable(station) {
    updateStation({ ...station, unresolvable: true })
    setPlaying({})
  }

  function handleClick(button) {
    switch (button) {
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

  function stopTimer() {
    clearInterval(timer.current)
    timer.current = null
    setTime(null)
  }

  function startTimer() {
    clearInterval(timer.current)
    const tick = () => setTime(Math.floor(node.current.currentTime))
    timer.current = setInterval(tick, 1000)
    tick()
  }

  return (
    <StyledPlayer>
      <Top>
        <Display time={ time } worklet={ worklet.current } />
        <Title title={ optionChanged || title || player.playing.name } />
        <Bitrate bitrate={ player.playing.bitrate } />
        <Samplerate samplerate={ player.playing.samplerate } />
        <Channels channels={ player.playing.channels } />
        <Volume
          setOptionChanged={ setOptionChanged }
          set={ v => gain.current.gain.value = v }
        />
        <Pan
          setOptionChanged={ setOptionChanged }
          set={ p => pan.current.pan.value = p }
        />
        <Playlist />
        <Equaliser />
      </Top>
      <Video
        ref={ node }
        sourceHeight={ sourceHeight.current }
        fullscreen={ fullscreen }
        onDoubleClick={ () => setFullscreen(last => !last) }
      />
      <Controls>
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
