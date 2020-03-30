import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setPan } from '../../actions/player'
import { Range } from './styled'

const Input = styled(Range).attrs({
  min: `-100`,
  max: `100`,
})`
  width: 38px;
  height: 5px;
  position: absolute;
  left: 166px;
  top: 36px;
`

function Pan({ set, pan, setPan, setOptionChanged }) {
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
    <Input
      defaultValue={ 0 }
      style={{ backgroundPositionY: `${ Math.abs(pan) }%` }}
      onChange={ handleChange }
      onMouseDown={ handleDown }
      onMouseUp={ handleUp }
    />
  )
}

const mapState = ({ player: { pan } }) => ({ pan })

const mapDispatch = (dispatch) => ({
  setPan: volume => dispatch(setPan(volume)),
})

export default connect(mapState, mapDispatch)(Pan)
