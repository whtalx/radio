import styled from 'styled-components'

export const StatusBar = styled.div`
  width: 100%;
  height: 1.3rem;
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  border-right: 1px solid hsl(212, 17%, 58%);
  justify-content: ${ props => props.favs ? `space-between` : `flex-start` };
  background-color: black;
`

export const Button = styled.button`
  margin: 0 .25em;
  padding: 0;
  height: 1.1rem;
  color: ${ ({ disabled }) => disabled ? `hsl(120, 30%, 20%)` : `inherit` };
  line-height: 1.1rem;
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
