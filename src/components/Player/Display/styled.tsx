import styled from 'styled-components'

import { filter } from '../../../functions'

import dot from '../../common/images/dot.png'

export const Wrapper = styled.div`
  width: calc(100% - 24px);
  height: 58px;
  position: absolute;
  left: 11px;
  top: 9px;
`

export const Background = styled.div`
  display: grid;
  grid-template: 58px / 48px auto 48px;
  border-radius: 8px;
  background-image: url(${ dot });
  background-size: 2px 2px;
  ${ filter(`displayBackground`) };
`

export const Content = styled.div`
  padding: 11px 8px 0;
  width: 100%;
  height: 39px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  ${ filter(`displayContents`) };
`

export const Spacer = styled.div`
  flex-grow: 1;
`

export const Overlay = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  opacity: .75;

  :last-child {
    transform: scaleX(-1);
  }
`
