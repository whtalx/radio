import styled from 'styled-components'

export const StatusBar = styled.div`
  position: sticky;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.1em;
  display: flex;
  flex-flow: row;
  align-items: center;
  background-color: hsl(0, 0%, 0%);
`

export const NavigateButton = styled.button`
  margin: 0;
  padding: 0;
  width: 1em;
  height: 1em;
`

export const Status = styled.p`
  flex-grow: 1;
`

export const Nav = styled.span`
  cursor: pointer;
`

export const Fav = styled.div`
  width: 1em;
  height: 1em;
  color: ${ props => props.showing ? `hsl(0, 0%, 100%)` : `hsl(120, 100%, 50%)` };
`
