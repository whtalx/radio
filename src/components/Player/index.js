import React, { useEffect, useReducer, useRef, useState, useLayoutEffect } from 'react'
import { ipcRenderer } from 'electron'
import Hls from 'hls.js'
import { StyledPlayer, Top, Video, Controls } from './styled'
import { Play, Stop, Previous, Next, Eject, Export } from './buttons'
import { Playlist, Equaliser, Shuffle, Favorite } from './switches'
import Samplerate from './samplerate'
import Channels from './channels'
import Display from './Display'
import Bitrate from './bitrate'
import Volume from './volume'
import Title from './title'
import Pan from './pan'
import { error, makePlayerState } from '../../functions'
import { reducer, initialState } from './reducer'

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hls = useRef(null)
  const pan = useRef(null)
  const node = useRef(null)
  const gain = useRef(null)
  const timer = useRef(NaN)
  const worklet = useRef(null)
  const sourceHeight = useRef(0)
  const station = useRef(state.playing)
  const [time, setTime] = useState(null)
  const [title, setTitle] = useState(``)
  const [fullscreen, setFullscreen] = useState(false)
  const [optionChanged, setOptionChanged] = useState(``)
  const [list, setList] = useState(JSON.parse(localStorage.list || `{ "favourites": [] }`))
  const [favourite, setFavourite] = useState(station.current.id && isFavourite({ station: station.current, list: list.favourites }))

  useEffect(
    () => {
      window.addEventListener(`storage`, () => {
        const newList = JSON.parse(localStorage.list || `{ "favourites": [] }`)
        setList(newList)
        station.current.id && setFavourite(isFavourite({ station: station.current, list: newList.favourites }))
      })

      const { webAudio } = window
      gain.current = webAudio.createGain()
      pan.current = webAudio.createStereoPanner()
      webAudio.createMediaElementSource(node.current).connect(gain.current)
      gain.current.connect(pan.current)
      pan.current.pan.value = state.pan / 100
      gain.current.gain.value = state.volume / 100
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

      ipcRenderer.on(`resolved`, (_, data) =>
        updateStation(data)
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
            ? height + sourceHeight.current - 8
            : 116
        ])
      )

      ipcRenderer.on(`pong`, (_, command) => {
        switch (command) {
          case `play`: {
            console.log(station.current)
            return ipcRenderer.send(`request`, station.current)
          }

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

      if (state.currentState !== `pending`) return
      station.current = state.playing
      const { current } = station
      setFavourite(current.id && isFavourite({ station: current, list: list.favourites }))

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
          sourceHeight.current = Math.round(height / width * 245)
        })

        hls.current.on(Hls.Events.ERROR, (e, data) => {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR: {
              console.log(`network error encountered`, data)
              const { code } = data.response || {}
              if (!code || code === 404 || code === 403) {
                unresolvable(state.playing)
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
              unresolvable(state.playing)
              break
            }
          }
        })
      } else if (!current.id) {
        stop()
      }

    },
    [state.playing] // eslint-disable-line
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
      state !== initialState && localStorage.setItem(`player`, JSON.stringify(state))
    },
    [
      state,
      state.pan,
      state.volume,
      state.playing,
      state.currentState,
    ]
  )

  useLayoutEffect(
    () => {
      ipcRenderer.send(`show`)
    },
    [] // eslint-disable-line
  )

  function updateStation(payload) {
    dispatch({ type: `UPDATE_STATION`, payload })
  }

  function setState(payload) {
    dispatch({ type: `SET_STATE`, payload })
  }

  function setPlaying(payload) {
    dispatch({ type: `SET_PLAYING`, payload })
  }

  function setRandom() {
    dispatch({ type: `SET_RANDOM` })
  }

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
          state.currentState === `paused` &&
          station.current.id &&
          (station.current.hls
            ? setPlaying({ ...station.current })
            : ipcRenderer.send(`request`, station.current))
        }

      case `stop`:
        return () => state.currentState !== `paused` && stop()

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

  function isFavourite({ station, list }) {
    return station.id && list.findIndex(({ id }) => id === station.id) >= 0
  }

  return (
    <StyledPlayer>
      <Top>
        <Display time={ time } worklet={ worklet.current } state={ state.currentState } />
        <Title title={ optionChanged || title || state.playing.name } />
        <Bitrate bitrate={ state.playing.bitrate } />
        <Samplerate samplerate={ state.playing.samplerate } />
        <Channels channels={ state.playing.channels } />
        <Volume
          setOptionChanged={ setOptionChanged }
          set={ v => gain.current.gain.value = v }
          setVolume={ payload => dispatch({ type: `SET_VOLUME`, payload }) }
          volume={ state.volume }
        />
        <Pan
          setOptionChanged={ setOptionChanged }
          set={ p => pan.current.pan.value = p }
          setPan={ payload => dispatch({ type: `SET_PAN`, payload }) }
          pan={ state.pan }
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
        <Previous />
        <Play onClick={ handleClick(`play`) } />
        <Stop onClick={ handleClick(`stop`) } />
        <Next />
        <Eject />
        <Export />
        <Shuffle random={ state.random } setRandom={ setRandom } />
        <Favorite
          favourite={ favourite }
          setFavourite={ () => station.current.id && ipcRenderer.send(`ping`, `list`, `toggleFavourite`) }
        />
      </Controls>
    </StyledPlayer>
  )
}
