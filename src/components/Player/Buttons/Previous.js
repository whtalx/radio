import React from 'react'
import styled from 'styled-components'

import { Background, SkewedButton } from './styled'

import prev from './images/prev-button.png'

const children = <Background src={ prev } height="200%" />

export const Previous = styled(SkewedButton).attrs((props) => ({ children, ...props }))`
  left: 5px;
  top: 79px;
`
