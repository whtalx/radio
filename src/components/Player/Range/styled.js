import styled, { css } from 'styled-components'

import { filter } from '../../../functions'

import knob from './images/knob.png'

export const Knob = styled.div`
  width: 22px;
  height: 13px;
  position: absolute;
  left: 0;
  top: -3px;
  background-image: url(${ knob });
  background-size: 200% 100%;
  ${ filter(`button`) };

  :hover {
    ${ filter(`buttonHover`) };
  }

  :active {
    ${ filter(`buttonPressed`) }
    background-position-x: 100%;
  }
`

export const Progress = styled.div`
  height: 2px;
  display: block;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 1px;
  background-image: linear-gradient(180deg, #AAC4F5 25%, #38568E 75%);
  ${ filter(`buttonTrim`) };
`

export const Wrapper = styled.div`
  width: 85px;
  height: 6px;

  ${ ({ layout }) => layout === `vertical` && css`
      transform-origin: center;
      transform: rotate(-90deg);
    `
  }
`
