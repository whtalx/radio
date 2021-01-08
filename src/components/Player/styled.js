import styled from 'styled-components'

import Range from './Range'

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
`

export const Volume = styled(Range)`
  position: absolute;
  left: 154px;
  top: 98px;

  :after {
    content: '';
    width: 100%;
    height: 10px;
    position: absolute;
    left: 0;
    top: -10px;
  }
`
