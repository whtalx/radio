import React from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  width: 23px;
  position: absolute;
  left: 207px;
  top: 22px;
  color: hsl(212, 18%, 61%);

  ${
    ({ channels }) => Number.isFinite(channels) && css`
      svg:nth-child(${ channels }) {
        color: hsl(117, 100%, 48%);
        filter: drop-shadow(0 0 1px currentColor) drop-shadow(0 0 2px currentColor);
      }
    `
  }
`

const Mono = styled.svg.attrs({
  viewBox: `0 0 17 4`,
  fillRule: `evenodd`,
  fill: `currentColor`,
})`
  width: 17px;
  height: 4px;
  position: absolute;
  left: 0;
  top: 1px;
`

const Stereo = styled.svg.attrs({
  viewBox: `0 0 23 5`,
  fillRule: `evenodd`,
  fill: `currentColor`,
})`
  width: 23px;
  height: 5px;
  position: absolute;
  left: 22px;
  top: 0;
`

export default ({ channels }) =>
  <Wrapper channels={ channels }>
    <Mono>
      <path d="M0 4V0H2V1H3V0H5V4H4V1H3V4H2V1H1V4H0Z" />
      <path d="M6 0H9V4H6V0ZM8 1H7V3H8V1Z" />
      <path d="M10 4V0H13V4H12V1H11V4H10Z" />
      <path d="M14 0H17V4H14V0ZM16 1H15V3H16V1Z" />
    </Mono>
    <Stereo>
      <path d="M0 1h2v1h-1v2h-1v1h2v-2h-2v-2Z"/>
      <path d="M4 0v1h-1v1h1v3h1v-3h1v-1h-1v-1h-1Z"/>
      <path d="M8 1h2v1h1v1h-3v2h2v-1h-3v-2h1Z"/>
      <path d="M14 1v1h-1v3h-1v-4h2Z"/>
      <path d="M16 1h2v1h1v1h-3v2h2v-1h-3v-2h1Z"/>
      <path d="M20 1v4h3v-4h-3zm1 1h1v2h-1v-2z"/>
    </Stereo>
  </Wrapper>
