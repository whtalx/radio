import styled, { css, keyframes } from 'styled-components'

const barSpin = keyframes`
  0% { content: '\\005C' }
  33% { content: '\\2013' }
  66% { content: '\\002F' }
  to { content: '\\007C' }
`

export const Container = styled.div`
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden scroll;
  background-color: hsl(0, 0%, 0%);
  color: hsl(120, 100%, 50%);

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
  padding-left: .5em;
  width: 100%;
  height: 1.1em;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  line-height: 1.1em;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: ${ props => props.playing ? `hsl(0, 0%, 100%)` : props.unresolvable && `hsl(0, 100%, 50%)` };

  :focus {
    border: none;
    outline: none;
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