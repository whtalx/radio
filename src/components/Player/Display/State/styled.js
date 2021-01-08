import styled, { css, keyframes } from 'styled-components'

import busy from './images/busy.png'
import play from './images/play.png'
import stop from './images/stop.png'

const rotate = keyframes`
  0%    { background-position-x: 100% }
  12.5% { background-position-x: 200% }
  25%   { background-position-x: 300% }
  37.5% { background-position-x: 400% }
  50%   { background-position-x: 500% }
  62.5% { background-position-x: 600% }
  75%   { background-position-x: 700% }
  87.5% { background-position-x: 800% }
  100%  { background-position-x: 100% }
`

const SimpleIcon = styled.div`
  background-size: 200% 100%;
  ${ ({ active }) => active && css`background-position-x: 100%;` }
`

export const Play = styled(SimpleIcon)`
  background-image: url(${ play });
`

export const Stop = styled(SimpleIcon)`
  background-image: url(${ stop });
`

export const Busy = styled.div`
  background-image: url(${ busy });
  background-size: 900% 100%;

  ${ ({ active }) => active && css`
      background-position-x: 100%;
      animation: ${ rotate } .667s step-start infinite;
    `
  }
`

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 8px;
  grid-template-rows: repeat(3, 7px);
`
