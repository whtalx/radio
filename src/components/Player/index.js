import React, { useContext, useRef, useState } from 'react'

import { State, Dispatch } from '../../reducer'

import { Previous, Play, Stop, Next, Mute } from './Buttons'
import { Wrapper, Volume } from './styled'
import Display from './Display'

export default function Player() {
  const state = useContext(State)
  const dispatch = useContext(Dispatch)
  const statusTimeout = useRef(NaN)
  const [status, setStatus] = useState(``)
  const { currentState, volume, station, isMuted = false } = state.player

  function play() {
    currentState !== `playing` && dispatch({ type: `play` })
  }

  function stop() {
    currentState !== `stopped` && dispatch({ type: `stop` })
  }

  function mute() {
    dispatch({ type: `mute`, payload: !isMuted })
    setStatus(`Volume: ${ isMuted ? Math.floor(volume * 100) : `0` }%`)
    sceduleStatusClear()
  }

  function changeVolume(value) {
    setStatus(`Volume: ${ Math.floor(value * 100) }%`)
    dispatch({ type: `volume`, payload: value })
  }

  function sceduleStatusClear() {
    statusTimeout.current && clearTimeout(statusTimeout.current)
    statusTimeout.current = setTimeout(clearStatus, 1000)
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

  return (
    <Wrapper>
      <Display info={ station?.info || {} } title={ station?.title || ` ` } status={ status } state={ currentState } />
      <Previous />
      <Play onClick={ play } switched={ currentState === `playing` } />
      <Stop onClick={ stop } switched={ currentState === `stopped` } />
      <Next />
      <Mute muted={ isMuted } onClick={ mute } />
      <Volume
        value={ volume }
        setValue={ changeVolume }
        onSetExact={ onSetExact }
        onDragStop={ onDragStop }
        onDragStart={ onDragStart }
      />
    </Wrapper>
  )
}
