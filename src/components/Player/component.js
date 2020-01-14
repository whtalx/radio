import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer, remote } from 'electron'
import Hls from 'hls.js'
import { StyledPlayer, Display, Title, Video, Controls } from './styled'
import Visualization from '../Visualization'
import AnalyserNode from '../../classes/AnalyserNode'
import error from '../../functions/error'

export default ({
  list,
  listToggle,
  setStation,
  player,
  setState,
  setPlayer,
  setPlaying,
}) => {
  const node = useRef(null)
  const [context] = useState(new AudioContext())
  const [bands] = useState(new AnalyserNode({ context, stc: .7 }))
  const [peaks] = useState(new AnalyserNode({ context, stc: .99 }))
  const [hls, setHls] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [sourceHeight, setSourceHeight] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const play = () => {
    node.current.play().catch((e) => {
      setState(`paused`)
      error(e)
    })
  }

  const stop = () => {
    setState(`paused`)

    if (hls) {
      hls.destroy()
      setHls(null)
    }

    node.current.pause()
  }

  useEffect(
    () => {
      const string = localStorage.getItem(`player`)
      const store = string && JSON.parse(string)
      store && setPlayer({ ...store, currentState: store.currentState === `paused` ? `paused` : `pending` })

      context.createMediaElementSource(node.current).connect(bands)
      bands.connect(peaks)
      peaks.connect(context.destination)
      setLoaded(true)

      node.current.addEventListener(`playing`, () => setState(`playing`))
      node.current.addEventListener(`loadstart`, () => {
        setState(/(file|localhost):/.test(node.current.src) ? `paused` : `loading`)
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
      if (!loaded) return
      const string = JSON.stringify(player)
      const storage = localStorage.getItem(`player`)
      string !== storage && localStorage.setItem(`player`, string)
    },
    [player] // eslint-disable-line
  )

  useEffect(
    () => {
      if (player.currentState !== `pending`) return
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
