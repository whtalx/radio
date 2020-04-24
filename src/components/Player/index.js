import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'
import Hls from 'hls.js'

import { Play, Stop, Previous, Next, Eject, Export } from './buttons'
import { StyledPlayer, Top, Video, Controls } from './styled'
import { Playlist, Favorite } from './switches'
import { Title, Bitrate, Samplerate } from './outputs'
import { Volume, Pan } from './ranges'
import Channels from './channels'
import Display from './Display'

import { error, makePlayerState } from '../../functions'
import {
  toggleFavourite,
  setVideoHeight,
  updateStation,
  listToggle,
  setPlaying,
  setVolume,
  setState,
  setPan,
} from '../../actions'


export default connect(
  ({ list, player }) => ({ list, player }),
  (dispatch) => ({
    toggleFavourite: station => dispatch(toggleFavourite(station)),
    setVideoHeight: height => dispatch(setVideoHeight(height)),
    updateStation: station => dispatch(updateStation(station)),
    setPlaying: station => dispatch(setPlaying(station)),
    setVolume: volume => dispatch(setVolume(volume)),
    setState: state => dispatch(setState(state)),
    listToggle: () => dispatch(listToggle()),
    setPan: pan => dispatch(setPan(pan)),
  }),
)(
  ({
    list,
    player,
    setPan,
    setState,
    setVolume,
    setPlaying,
    listToggle,
    updateStation,
    setVideoHeight,
    toggleFavourite,
  }) => {
    const hls = useRef(null)
    const pan = useRef(null)
    const node = useRef(null)
    const gain = useRef(null)
    const timer = useRef(NaN)
    const worklet = useRef(null)
    const station = useRef(player.playing)
    const [time, setTime] = useState(null)
    const [title, setTitle] = useState(``)
    const [fullscreen, setFullscreen] = useState(false)
    const [optionChanged, setOptionChanged] = useState(``)
    const [favourite, setFavourite] = useState(station.current.id && isFavourite({ station: station.current, list: list.favourites }))

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

        ipcRenderer.on(`resolved`, (_, data) =>
          updateStation(data)
        )

        ipcRenderer.on(`served`, (_, port) =>
          node.current.src = `http://[::1]:${ port }`
        )

        ipcRenderer.on(`metadata`, (_, data = {}) =>
          setTitle(data.StreamTitle || ``)
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
        player.videoHeight !== 0 && setVideoHeight(0)
        hls.current && hls.current.destroy()
        setTitle(``)
        stopTimer()

        if (player.currentState !== `pending`) return
        station.current = player.playing
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
            setVideoHeight(Math.round(height / width * 245))
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
        !list.visible && ipcRenderer.send(`setHeight`, 0, player.videoHeight ? player.videoHeight + 108 : 116)
      },
      [player.videoHeight] // eslint-disable-line
    )

    useEffect(
      () => {
        if (player.videoHeight === 0) return

        document.fullscreenElement
          ? document.exitFullscreen()
          : node.current.requestFullscreen()
      },
      [fullscreen] // eslint-disable-line
    )

    useEffect(
      () => {
        if (player.currentState === `paused` && !node.current.paused) stop()
      },
      [player.currentState] // eslint-disable-line
    )

    useEffect(
      () => {
        station.current.id && setFavourite(isFavourite({ station: station.current, list: list.favourites }))
      },
      [list.favourites.length] // eslint-disable-line
    )

    function stop() {
      ipcRenderer.send(`abort`)
      stopTimer()

      if (hls.current) {
        hls.current.destroy()
        hls.current = null
        player.videoHeight !== 0 && setVideoHeight(0)
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

    function isFavourite({ station, list }) {
      return station.id && list.findIndex(({ id }) => id === station.id) >= 0
    }

    function toggleVisible() {
      ipcRenderer.send(`setHeight`, list.visible ? 0 : 484, player.videoHeight ? player.videoHeight + 108 : 116)
      listToggle()
    }

    return (
      <StyledPlayer videoHeight={ player.videoHeight }>
        <Top>
          <Display time={ time } worklet={ worklet.current } state={ player.currentState } />
          <Title title={ optionChanged || title || station.current.name } />
          <Bitrate bitrate={ station.current.bitrate } />
          <Samplerate samplerate={ station.current.samplerate } />
          <Channels channels={ station.current.channels } />
          <Volume
            setOptionChanged={ setOptionChanged }
            set={ v => gain.current.gain.value = v }
            setVolume={ setVolume }
            volume={ player.volume }
          />
          <Pan
            setOptionChanged={ setOptionChanged }
            set={ p => pan.current.pan.value = p }
            setPan={ setPan }
            pan={ player.pan }
          />
          <Playlist visible={ list.visible } toggleVisible={ toggleVisible } />
        </Top>
        <Video
          ref={ node }
          videoHeight={ player.videoHeight }
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
          <Favorite
            favourite={ favourite }
            setFavourite={ () => station.current.id && toggleFavourite(station.current) }
          />
        </Controls>
      </StyledPlayer>
    )
  }
)
