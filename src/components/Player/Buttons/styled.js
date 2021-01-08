import React from 'react'
import styled, { css } from 'styled-components'

import { Image } from '../../common'

import skewedTrim from './images/prev-trim.png'

import background from './images/play-stop.png'
import trim from './images/play-stop-trim.png'
import icon from './images/play-stop-icon.png'

export const Trim = styled(Image(`buttonTrim`))`
  display: none;
`

export const Icon = styled(Image(`buttonIcon`))`
  display: none;
`

export const Background = Image(`button`)

export const StyledButton = styled.button`
  position: absolute;
  overflow: hidden;

  :hover ${ Trim } {
    display: block;
  }
`

export const Round = styled(StyledButton)`
  width: 27px;
  height: 27px;
  ${ ({ switched }) => switched && css`${ Icon } { display: block }` }
`

export const StyledSkewed = styled(StyledButton)`
  width: 26px;
  height: 25px;
  background-size: 100% 200%;

  :active ${ Background } {
    top: -26px;
  }
`

export function RoundButton(props) {
  return (
    <Round { ...props }>
      <Background src={ background } width="200%" height="200%" />
      <Icon src={ icon } width="200%" />
      <Trim src={ trim } />
    </Round>
  )
}


export function SkewedButton(props) {
  return (
    <StyledSkewed { ...props }>
      { props.children }
      <Trim src={ skewedTrim } />
    </StyledSkewed>
  )
}
