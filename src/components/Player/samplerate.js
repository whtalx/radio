import React from 'react'
import styled from 'styled-components'
import { Output, Title } from './styled'

const Wrapper = styled(Output)`
  width: 16px;
  position: absolute;
  left: 141px;
  top: 17px;
  font-family: bm;
  -webkit-font-smoothing: none;

  svg {
    width: 13px;
    height: 6px;
    position: absolute;
    left: 18px;
    top: 3px;
  }
`

const Content = styled(Title)`
  width: 13px;
  height: 11px;
  font-size: 10px;
`

export default ({ samplerate }) =>
  <Wrapper>
    <Content>
      { samplerate }
    </Content>
    <svg width="13" height="6" viewBox="0 0 13 6" fill="white">
      <path d="M0 0H1V3H2V2H3V3H2V5H3V6H2V5H1V6H0V0ZM4 1H5V3H7V1H8V6H7V4H5V6H4V1ZM13 2H9V3H11V4H12V3H13V2ZM10 4V5H9V6H13V5H11V4H10Z"/>
    </svg>
  </Wrapper>


