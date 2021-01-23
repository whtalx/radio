import React from 'react'
import styled from 'styled-components'

import { Background, SkewedButton, Trim } from './styled'

import next from './images/next-button.png'

const children = <Background src={ next } height="200%" />

export const Next = styled(SkewedButton).attrs(() => ({ children }))`
  left: 95px;
  top: 79px;

  ${ Trim } {
    transform: scaleX(-1);
  }
`
