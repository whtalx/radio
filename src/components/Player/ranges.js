import React from 'react'
import styled from 'styled-components'
import { Range } from './styled'

const VolumeRange = styled(Range).attrs({
  min: `0`,
  max: `100`,
})`
  width: 80px;
  height: 5px;
  position: absolute;
  left: 97px;
  top: 39px;
`

export function Volume({ set, volume, setVolume, setOptionChanged }) {
  function handleChange({ target }) {
    const { value } = target
    const newVolume = parseInt(value)
    set(newVolume / 100)
    showVolume(newVolume)
    target.style.backgroundPositionY = `${ newVolume }%`
  }

  function handleDown({ target: { value } }) {
    showVolume(parseInt(value))
  }

  function handleUp({ target: { value } }) {
    const newVolume = parseInt(value)
    set(newVolume / 100)
    setVolume(newVolume)
    setOptionChanged(``)
  }

  function showVolume(v) {
    setOptionChanged(`Volume: ${ v }%`)
  }

  return (
    <VolumeRange
      defaultValue={ volume }
      style={{ backgroundPositionY: `${ volume }%` }}
      onChange={ handleChange }
      onMouseDown={ handleDown }
      onMouseUp={ handleUp }
    />
  )
}

const PanRange = styled(Range).attrs({
  min: `-100`,
  max: `100`,
})`
  width: 46px;
  height: 5px;
  position: absolute;
  left: 181px;
  top: 39px;
`

export function Pan({ set, pan, setPan, setOptionChanged }) {
  function handleChange({ target }) {
    const { value } = target
    if (Math.abs(value) > 23) {
      const newPan = parseInt(value)
      set(newPan / 100)
      showPan(newPan)
      target.style.backgroundPositionY = `${ Math.abs(newPan) }%`
    } else {
      set(0)
      target.value = 0
      showPan(0)
      target.style.backgroundPositionY = `0%`
    }
  }

  function handleDown({ target: { value } }) {
    showPan(parseInt(value))
  }

  function handleUp({ target: { value } }) {
    const newPan = parseInt(value)
    setPan(newPan)
    set(newPan / 100)
    setOptionChanged(``)
  }

  function showPan(p) {
    setOptionChanged(`Balance: ${ p === 0 ? `Center` : `${ Math.abs(p) }% ${ p > 0 ? `Right` : `Left` }` }`)
  }

  return (
    <PanRange
      defaultValue={ 0 }
      style={{ backgroundPositionY: `${ Math.abs(pan) }%` }}
      onChange={ handleChange }
      onMouseDown={ handleDown }
      onMouseUp={ handleUp }
    />
  )
}
