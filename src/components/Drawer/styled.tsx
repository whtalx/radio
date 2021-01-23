import styled from 'styled-components'

import { Image as Img } from '../common'

import { filter } from '../../functions'

import button from './images/toggle.png'

export const Wrapper = styled.div`
  margin-top: ${ (props: { [x: string]: any }) => props['data-opened'] ? -17 : -45 }px;
  width: 100%;
  height: calc(100% - 116px);
  min-height: 45px;
  display: grid;
  grid-template: 19px auto 26px / 20px auto 82px;
`

export const Image = styled(Img(`primaryBackground`))`
  z-index: -1;

  ${ Wrapper } > & {
    position: relative;
  }
`

export const Tabs = styled.div`
  display: flex;
  flex-flow: row;

  ${ Wrapper }[data-opened="false"] & {
    z-index: -1
  }
`

export const Space = styled(Image)`
  flex-grow: 1;
`

export const Toggle = styled.button`
  width: 27px;
  height: 9px;
  margin: 14px 0 0 8px;
  background-image: url(${ button });
  background-size: 200% 200%;
  z-index: 1;
  ${ filter(`button`) };

  ${ Wrapper }[data-opened="false"] & {
    background-position-x: 100%
  }

  :hover {
    ${ filter(`buttonHover`) }
  }

  :active {
    ${ filter(`buttonPressed`) }
    background-position-y: -100%;
  }
`

export const Content = styled.div`
  padding: 5px;
  width: calc(100% - 30px);
  height: calc(100% - 44px);
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  left: 14px;
  top: 18px;
  border-radius: 5px;

  :before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    background-image: linear-gradient(#8B93A0 0%, #7E8694 100%);
    ${ filter(`primaryBackground`) }
  }

  :after {
    content: '';
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 0;
    box-shadow:
    -.5px -.5px 1px .5px #424B5A,
    .5px .5px 1px .5px #B8BECA;
    ${ filter(`primaryBackground`) }
  }

  ${ Wrapper }[data-opened="false"] & {
    z-index: -1
  }
`
