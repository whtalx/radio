import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  min-width: 324px;
  height: ${ ({ drawer }) => drawer ? '100%' : `133px` };
  min-height: 133px;
  transition: width .1s, height .1s;
  overflow: hidden visible;
`