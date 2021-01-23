import React, { useContext, useEffect, useRef, useState } from 'react'

import { StateContext, DispatchContext } from '../../store'
import Localise from '../../i18n'

import { Previous, Play, Stop, Next, Mute } from './Buttons'
import { Wrapper, Volume } from './styled'
import Display from './Display'

interface Titles {
  play?: string,
  stop?: string,
  next?: string,
  previous?: string,
}

export default function Player() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const statusTimeout = useRef(NaN)
  const localise = useContext(Localise)
  const [status, setStatus] = useState(``)
  const [titles, setTitles]: [Titles, any] = useState({})
  const { currentState, volume, isMuted = false } = state.player
  const stopped = currentState === `stopped`

  function play() {
    stopped && dispatch({ type: `play` })
  }

  function stop() {
    !stopped && dispatch({ type: `stop` })
  }

  function mute() {
    dispatch({ type: `mute`, payload: !isMuted })
    setStatus(`Volume: ${ isMuted ? Math.floor(volume * 100) : `0` }%`)
    sceduleStatusClear()
  }

  function changeVolume(value: number) {
    setStatus(`Volume: ${ Math.floor(value * 100) }%`)
    dispatch({ type: `volume`, payload: value })
  }

  function sceduleStatusClear() {
    statusTimeout.current && clearTimeout(statusTimeout.current)
    statusTimeout.current = window.setTimeout(clearStatus, 1000)
  }

  function clearStatus() {
    statusTimeout.current && clearTimeout(statusTimeout.current)
    setStatus(``)
  }

  function onSetExact() {
    sceduleStatusClear()
  }

  function onDragStart() {
    setStatus(`Volume: ${ Math.floor(volume * 100) }%`)
  }

  function onDragStop() {
    setStatus(``)
  }

  useEffect(
    () => {
      function getTitles() {
        return {
          play: localise(`play`),
          stop: localise(`stop`),
          next: localise(`next`),
          previous: localise(`previous`),
        }
      }

      setTitles(getTitles())
    },
    [state.window.locale] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Wrapper>
      <Display status={status} />
      <Previous title={titles.previous} />
      <Play onClick={play} title={titles.play} switched={!stopped} />
      <Stop onClick={stop} title={titles.stop} switched={stopped} />
      <Next title={titles.next} />
      <Mute muted={isMuted} onClick={mute} />
      <Volume
        value={volume}
        setValue={changeVolume}
        onSetExact={onSetExact}
        onDragStop={onDragStop}
        onDragStart={onDragStart}
      />
    </Wrapper>
  )
}
