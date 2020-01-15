import styled from 'styled-components'

export const StyledPlayer = styled.div`
  width: 264px;
  height: max-content;
  display: flex;
  flex-flow: column;
  align-content: center;
  justify-content: flex-start;

  section {
    display: flex;
  }
`

export const Display = styled.div`
  width: 92px;
  height: 44px;
  position: relative;
`

export const Title = styled.div`
  width: calc(100% - 100px);
  height: 1.1em;
  overflow: hidden;
  font-size: 1em;
  line-height: 1.1em;
  background-color: hsl(0, 0%, 0%);
  color: hsl(120, 100%, 50%);
`

export const Tick = styled.span`
  white-space: nowrap;
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
