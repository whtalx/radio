import styled, { css, keyframes } from 'styled-components'

const barSpin = keyframes`
  0% { content: '\\005C' }
  33% { content: '\\2013' }
  66% { content: '\\002F' }
  to { content: '\\007C' }
`

export const Wrapper = styled.div`
  padding: 4px 2px 3px 3px;
  width: 100%;
  height: 100%;
  color: hsl(120, 100%, 50%);
`

export const Reservoir = styled.div`
  padding: 1px 0 0 1px;
  width: 259px;
  height: 100%;
  border-color: black;
  border-style: solid;
  border-width: 1px 0 0 1px;
`

export const Container = styled.div`
  width: 100%;
  height: calc(100% - 13px);
  overflow: hidden scroll;
  background-color: black;
  border-color: hsl(212, 17%, 58%);
  border-style: solid;
  border-width:  0 1px 1px 0;

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