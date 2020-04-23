import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Player from '../Player'
import List from '../List'
import {
  Wrapper,
  Title,
  Content,
  Frame,
  Shadow,
  Spacer,
  Close,
  Minimize,
} from './styled'

import { control } from '../../functions'

const ListFrame = styled(Frame)`
  flex-grow: 1;
  max-height: calc(100% - ${ ({ videoHeight }) => videoHeight ? 92 + videoHeight : 100 }px);
`

export default connect (
  ({ player: { videoHeight }}) => ({ videoHeight })
)(
  ({ videoHeight }) => {
    return (
      <Wrapper>
        <Shadow />
        <Title>
          <Spacer />
          &nbsp;webradio&nbsp;
          <Spacer />
          <Minimize title={ `minimize` } onClick={ control(`minimize`) } />
          <Close title={ `close` } onClick={ control(`close`) } />
        </Title>
        <Content>
          <Frame>
            <Player />
          </Frame>
          <ListFrame videoHeight={ videoHeight }>
            <List />
          </ListFrame>
        </Content>
      </Wrapper>
    )
  }
)
