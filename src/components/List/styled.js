import styled, { css, keyframes } from 'styled-components'

const barSpin = keyframes`
  0% { content: '\\005C' }
  33% { content: '\\2013' }
  66% { content: '\\002F' }
  to { content: '\\007C' }
`

export const Wrapper = styled.div`
  width: 257px;
  height: 478px;
  box-sizing: border-box;
  border-color: black;
  border-style: solid;
  border-width: 1px 0 0 1px;
`

export const Container = styled.div`
  width: 254px;
  height: 475px;
  box-sizing: border-box;
  overflow: hidden scroll;
  background-color: black;
  color: hsl(120, 100%, 50%);
  border-bottom: 2px solid black;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 hsl(212, 17%, 58%);

  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  ::-webkit-scrollbar:vertical {
    width: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: hsl(120, 100%, 50%);
  }

  ::-webkit-scrollbar-track {
    background: hsl(120, 30%, 10%);
  }
`

export const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

export const Li = styled.li.attrs({
  tabIndex: 1,
})`
  padding-left: .5rem;
  width: 100%;
  height: 1.3rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border: none;
  outline: none;
  font-size: 1.1rem;
  line-height: 1.3rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: ${ props => props.playing ? `hsl(0, 0%, 100%)` : props.unresolvable && `hsl(0, 100%, 50%)` };

  :focus {
    background-color: hsl(240, 100%, 50%);
  }

  ${
    props => props.processing && css`
      :after {
        content: '\\005C';
        position: absolute;
        top: 0;
        right: 0;
        width: 1em;
        text-align: center;
        animation: ${ barSpin } .5s linear infinite;
      }
    `
  }
`