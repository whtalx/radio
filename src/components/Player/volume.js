import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setVolume } from '../../actions/player'

const Range = styled.input.attrs({
  type: `range`,
  min: `0`,
  max: `100`,
})`
  width: 64px;
  height: 5px;
  position: absolute;
  left: 97px;
  top: 36px;
  border: 1px solid black;
  border-radius: 2px;
  background-image: linear-gradient(0deg, hsl(358, 88%, 55%) 0%, hsl(34, 84%, 55%) 25%, hsl(67, 79%, 50%) 50%, hsl(87, 85%, 45%) 75%, hsl(115, 86%, 40%) 100%);
  background-position-x: 100%;
  background-repeat: no-repeat;
  background-size: 100% 1000%;
  box-shadow: inset 2px 2px 3px hsla(0, 0%, 0%, .75);
  -webkit-appearance: none;

  ::-webkit-slider-thumb {
    width: 14px;
    height: 11px;
    -webkit-appearance: none;
    border: 1px solid black;
    border-radius: 2px;
    background-color: hsl(201, 16%, 72%);
    background-image: linear-gradient(90deg, black 0%, black 20%, hsl(212, 17%, 58%) 20%, hsl(212, 17%, 58%) 40%, black 40%, black 60%, hsl(212, 17%, 58%) 60%, hsl(212, 17%, 58%) 80%, black 80%, black 100%);
    background-position: 3px 3px;
    background-repeat: no-repeat;
    background-size: 5px 3px;
    box-shadow:
      inset -1px -1px 0 hsl(214, 9%, 48%),
      inset 1px 1px 0 hsl(191, 28%, 89%),
      inset -2px -2px 0 hsl(212, 17%, 58%);
  }

  :focus {
    outline: none;
  }
`

function Volume({ setVolume, volume }) {
  return (
    <Range
      defaultValue={ volume }
      style={{ backgroundPositionY: `${ volume }%` }}
      onChange={ ({ target: { value } }) => setVolume(parseInt(value)) }
    />
  )
}

const mapState = ({ player: { volume } }) => ({ volume })

const mapDispatch = (dispatch) => ({
  setVolume: volume => dispatch(setVolume(volume)),
})

export default connect(mapState, mapDispatch)(Volume)
