import styled from 'styled-components'

import { Image } from '../../common'

import { filter } from '../../../functions'

import buttons from './images/buttons.png'

export const Wrapper = styled.div`
  width: 100%;
  height: 18px;
  display: grid;
  grid-template: 18px / 10px auto 10px;
  -webkit-app-region: drag;
`

export const Background = styled(Image(`titlebarBackground`))`
  position: relative;
`

export const Contents = styled.div`
  padding: 4px 5px 3px;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
`

export const Button = styled.button`
  width: 10px;
  height: 10px;
  overflow: hidden;
  background-image: url(${ buttons });
  background-size: 300% 200%;
  -webkit-app-region: no-drag;
  ${ filter(`titlebarContents`) }

  :hover {
    ${ filter(`buttonHover`) }
  }

  :active {
    background-position-y: -100%;
  }
`

export const Menu = styled(Button)`
  margin-right: 5px;
`

export const Hide = styled(Button)`
  margin-left: 5px;
  margin-right: 1px;
  background-position-x: -100%;
`

export const Close = styled(Button)`
  background-position-x: -200%;
`

export const Title = styled(Image('titlebarContents')).attrs(() => ({
  height: `10px`,
}))`
  position: relative;
`

export const SpacerLeft = styled(Title)`
  width: calc(50% - 62.5px);
`

export const SpacerRight = styled(Title)`
  width: calc(50% - 73.5px);
`
