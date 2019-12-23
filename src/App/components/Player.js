import React from 'react'
import styled from 'styled-components'

const Main = styled.div`
  width: 275px;
  height: 116px;
  box-sizing: border-box;
  background-image: linear-gradient(to right bottom, hsl(240, 52%, 13%) 0%, hsl(240, 41%, 16%) 15%, hsl(240, 38%, 26%) 35%, hsl(240, 30%, 32%) 50%, hsl(240, 34%, 29%) 75%, hsl(240, 33%, 9%) 100%);
  border: 1px solid black;
  box-shadow:
    inset 1px 1px 2px hsl(199, 22%, 45%);
  -webkit-app-region: drag;
`

export default (props) => // TODO: svg
  <Main>
    &nbsp;
  </Main>
