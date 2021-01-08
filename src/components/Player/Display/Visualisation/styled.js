import styled from 'styled-components'

import { WIDTH, HEIGHT } from './constants'

import spectre from './images/spectre.png'

export const Wrapper = styled.div`
  margin-top: -5px;
  width: 84px;
  height: 32px;
  background-image: url(${ spectre });
  background-size: 100% 100%;
`

export const Canvas = styled.canvas`
  margin: 1px 7px 6px 6px;
  width: ${ WIDTH }px;
  height: ${ HEIGHT }px;
`
