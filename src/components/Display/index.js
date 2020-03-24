import React from 'react'
import styled from 'styled-components'
import { ReactComponent as SVG } from './display.svg'

const Wrapper = styled.div`
  width: 92px;
  height: 44px;
  position: relative;
  left: 3px;
  top: 1px;
`

const Background = styled(SVG)`
  position: absolute;
  left: 0;
  top: 0;
`

export default function Display({ children }) {
  return (
    <Wrapper>
      <Background />
      { children }
    </Wrapper>
  )
}
