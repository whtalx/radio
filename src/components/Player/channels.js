import React from 'react'
import styled, { css } from 'styled-components'

import { ReactComponent as Mono } from '../../icons/mono.svg'
import { ReactComponent as Stereo } from '../../icons/stereo.svg'

const Wrapper = styled.div`
  width: 46px;
  height: 5px;
  position: absolute;
  left: 207px;
  top: 22px;
  color: hsl(212, 18%, 61%);
  display: flex;
  justify-content: space-between;

  ${
    ({ channels }) => Number.isFinite(channels) && css`
      svg:nth-child(${ channels }) {
        color: hsl(117, 100%, 48%);
        filter: drop-shadow(0 0 1px currentColor) drop-shadow(0 0 2px currentColor);
      }
    `
  }
`

export default ({ channels }) =>
  <Wrapper channels={ channels }>
    <Mono />
    <Stereo />
  </Wrapper>
