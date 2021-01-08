import styled from 'styled-components'

import { filter } from '../../../../functions'

import top from './images/top.png'
import center from './images/center.png'
import fill from './images/fill.png'
import bottom from './images/bottom.png'

export const Top = styled.div`
  height: 7px;
  min-height: 7px;
  background-image: url(${ top });
`

export const Center = styled.div`
  height: 13px;
  min-height: 13px;
  background-image: url(${ center });
`
export const Fill = styled.div`
  flex-grow: 1;
  background-image: url(${ fill });
`

export const Bottom = styled.div`
  height: 7px;
  min-height: 7px;
  background-image: url(${ bottom });
`

export const Wrapper = styled.div`
  width: 13px;
  max-height: 100%;
  display: flex;
  flex-flow: column;
  ${ filter(`button`) };

  ${ Top },
  ${ Center },
  ${ Fill },
  ${ Bottom } {
    width: 100%;
    background-size: 200% 100%;
  }

  :hover {
    ${ filter(`buttonHover`) }
  }

  :active {
    ${ filter(`buttonPressed`) }

    ${ Top },
    ${ Center },
    ${ Fill },
    ${ Bottom } {
      background-position-x: 100%;
    }
  }
`
