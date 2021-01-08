import React, { useRef, useState } from 'react'

import { Previous, Play, Stop, Next, Mute } from './Buttons'
import { Wrapper, Volume } from './styled'
import Display from './Display'

const INFO = {
  bitrate: 256,
  samplerate: 44100,
  channels: 2,
  type: 'mp3',
  favourite: true,
}

export default function Player() {
  const statusTimeout = useRef(NaN)
  const [isMuted, setMuted] = useState(false)
  const [state, setState] = useState(`stopped`)
  const [volume, setVolume] = useState(.5)
  const [status, setStatus] = useState(``)
  const [title, setTitle] = useState(` `)
  const [info, setInfo] = useState({})

  function play() {
    if (state === `playing`) return

    setInfo(INFO)
    setState(`playing`)
    setTitle(`Lorem ipsum dolor sit amet consectetur adipiscing elit Integer nec odio Praesent libero Sed cursus ante dapibus diam Sed nisi Nulla quis sem at nibh elementum imperdiet`)
  }

  function stop() {
    if (state === `stopped`) return

    setState(`stopped`)
    setTitle(``)
    setInfo({})
  }

  function mute() {
    setMuted(a => !a)
    setStatus(`Volume: ${ isMuted ? Math.floor(volume * 100) : `0` }%`)
    sceduleStatusClear()
  }

  function changeVolume(value) {
    setStatus(`Volume: ${ Math.floor(value * 100) }%`)
    setVolume(value)
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
      <Display info={ info } title={ title } status={ status } state={ state } />
      <Previous />
      <Play onClick={ play } switched={ state === `playing` } />
      <Stop onClick={ stop } switched={ state === `stopped` } />
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
