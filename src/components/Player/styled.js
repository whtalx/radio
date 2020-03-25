import styled from 'styled-components'

export const StyledPlayer = styled.div`
  height: max-content;
  display: flex;
  flex-flow: column;
  align-content: center;
  justify-content: flex-start;

  section {
    display: flex;
  }
`

export const Top = styled.div`
  width: 100%;
  height: 50px;
  position: relative;
`

export const Video = styled.video`
  margin: 0 auto;
  width: 244px;
  height: ${ props => props.sourceHeight || 8 }px;
  border-top-color: hsl(240, 100%, 3%);
  border-left-color: hsl(240, 100%, 3%);
  border-right-color: hsl(240, 18%, 27%);
  border-bottom-color: hsl(240, 18%, 27%);
  border-style: solid;
  border-width: 1px;

  :fullscreen {
    border: none;

    ::-webkit-media-controls {
      display: none !important;
    }
  }
`

export const Controls = styled.div`
  height: 36px;
`

export const Output = styled.div`
  padding: 1px 0 0 1px;
  height: 13px;
  box-sizing: border-box;
  border-width: 1px 0 0 1px;
  border-style: solid;
  border-color: black;
  color: hsl(120, 100%, 50%);
`

export const Title = styled.div`
  height: 10px;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  font-size: 9px;
  line-height: 10px;
  background-color: black;
  color: hsl(120, 100%, 50%);
  border-right: 1px solid black;
  border-left: 1px solid black;
  box-shadow: .5px .5px 0 .5px hsl(217, 22%, 63%);
`

export const Tick = styled.p`
  width: max-content;
  white-space: nowrap;
`
