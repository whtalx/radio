import React from 'react'
import styled from 'styled-components'
import { Output, Title } from './styled'

const Wrapper = styled(Output)`
  width: 23px;
  position: absolute;
  left: 96px;
  top: 17px;
  font-family: bm;
  text-align: right;
  -webkit-font-smoothing: none;

  svg {
    width: 15px;
    height: 7px;
    position: absolute;
    left: 26px;
    top: 3px;
  }
`

const Content = styled(Title)`
  width: 21px;
  height: 11px;
  font-size: 10px;
`

export default ({ bitrate }) =>
  <Wrapper>
    <Content>
      { Number.isFinite(bitrate) && Math.floor(bitrate) }
    </Content>
    <svg viewBox="0 0 15 7" fillRule="evenodd" fill="white">
      <path d="M0 0H1V3H2V2H3V3H2V5H3V6H2V5H1V6H0V0ZM4 0V6H7V5H8V3H7V2H5V0H4ZM7 3H5V5H7V3ZM11 2H9V7H10V6H11V5H10V3H11V2ZM12 5V3H11V5H12ZM15 2H13V4H14V3H15V2ZM14 5H13V6H15V4H14V5Z"/>
    </svg>
  </Wrapper>
