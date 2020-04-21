import React from 'react'
import styled from 'styled-components'
import { Range } from './styled'

const Input = styled(Range).attrs({
  min: `0`,
  max: `100`,
})`
  width: 64px;
  height: 5px;
  position: absolute;
  left: 97px;
  top: 39px;
`

export default function Volume({ set, volume, setVolume, setOptionChanged }) {
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
    <Input
      defaultValue={ volume }
      style={{ backgroundPositionY: `${ volume }%` }}
      onChange={ handleChange }
      onMouseDown={ handleDown }
      onMouseUp={ handleUp }
    />
  )
}
