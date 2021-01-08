import styled from 'styled-components'

import { StyledButton } from './styled'

import { filter } from '../../../functions'

import mute from './images/mute.png'

export const Mute = styled(StyledButton)`
  width: 14px;
  height: 14px;
  left: 134px;
  top: 90px;
  background-image: url(${ mute });
  background-position: ${ ({ muted }) => muted ? `100% 0` : `0 0` };
  background-size: 200% 200%;
  ${ filter(`button`) };

  :hover {
    ${ filter(`buttonHover`) }
  }

  :active {
    ${ filter(`buttonPressed`) }
    background-position-y: 100%;
  }
`