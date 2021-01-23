import styled, { StyledComponentBase } from 'styled-components'

import { Image } from '../../common'

import { color } from '../../../functions'

export const Background: StyledComponentBase<'img', any, { relative?: boolean }, never> = Image(`primaryBackground`)

export const Wrapper = styled.div`
  height: 26px;
  display: flex;
  flex-flow: row;
`

export const Content = styled.div`
  height: 100%;
  color: black;
  font: 5px pix;
  line-height: 27px;
  text-transform: uppercase;
  ${ color(`text`) }
`
