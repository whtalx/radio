import React from 'react'
import styled from 'styled-components'
import { Output, Title } from './styled'

const Wrapper = styled(Output)`
  width: 21px;
  position: absolute;
  left: 96px;
  top: 17px;
`

const Content = styled(Title)`
  width: 18px;
`

export default ({ bitrate }) =>
  <Wrapper>
    <Content>
      { bitrate }
    </Content>
  </Wrapper>
