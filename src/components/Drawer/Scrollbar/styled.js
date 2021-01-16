import styled from 'styled-components'

import { filter } from '../../../functions'

import bg from './images/bg.png'
import top from './images/top.png'
import bottom from './images/bottom.png'

export const Wrapper = styled.div`
  width: 13px;
  height: 100%;
  display: flex;
  flex-flow: column;
  isolation: isolate!important;

  :before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    box-sizing: border-box;
    background: url(${ bg });
    background-size: 100% 1px;
    background-repeat: repeat-y;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    ${ filter(`scrollbar`) };
  }

  &[hidden] {
    width: 0;
    visibility: hidden;
    pointer-events: none;

    :before {
      display: none;
    }
  }
`

const Button = styled.button`
  width: 13px;
  height: 18px;
  min-height: 18px;
  background-size: 200% 100%;
  isolation: isolate!important;
  ${ filter(`button`) };

  :hover {
    ${ filter(`buttonHover`) }
  }

  :active {
    ${ filter(`buttonPressed`) }
    background-position-x: 100%;
  }
`

export const Bar = styled.div`
  margin: -1px 0;
  width: 13px;
  height: 100%;
  flex-grow: 1;
`

export const Top = styled(Button)`
  background-image: url(${ top });
`

export const Bottom = styled(Button)`
  background-image: url(${ bottom });
`
