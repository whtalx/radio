import styled from 'styled-components'

export const StatusBar = styled.div`
  position: sticky;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.3em;
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  justify-content: ${ props => props.favs ? `space-between` : `flex-start` };
  background-color: hsl(0, 0%, 0%);
`

export const Button = styled.button`
  margin: 0 .25em;
  padding: 0;
  height: 1.1em;
  color: ${ ({ disabled }) => disabled ? `hsl(120, 30%, 20%)` : `inherit` };
  line-height: 1;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
`

export const Status = styled.p`
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Nav = styled.span`
  cursor: pointer;
`
