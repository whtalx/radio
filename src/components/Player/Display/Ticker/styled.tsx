import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  height: 16px;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 40px;
  display: flex;
  color: ${ ({ theme }) => theme.displayTitle?.color || 'white' };
  font-family: dot;
  font-size: 16px;
  line-height: 1;
  text-shadow: 0 0 5px currentColor;
  white-space: nowrap;
  mask-image: linear-gradient(
    90deg,
    transparent 5px,
    black 10px,
    black calc(100% - 10px),
    transparent calc(100% - 5px)
  );
`

export const Status = styled.div`
  margin: 0 auto;
`

export const Title = styled.div`
  padding: 0 10px;
`
