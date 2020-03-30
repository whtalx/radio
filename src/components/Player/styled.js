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
  height: 15px;
  box-sizing: border-box;
  border-width: 1px 0 0 1px;
  border-style: solid;
  border-color: black;
  color: hsl(120, 100%, 50%);
`

export const Title = styled.div`
  height: 12px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  font-size: 10px;
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

export const Range = styled.input.attrs({
  type: `range`,
})`
  height: 5px;
  border: 1px solid black;
  border-radius: 2px;
  background-image: linear-gradient(0deg, hsl(358, 88%, 55%) 0%, hsl(34, 84%, 55%) 25%, hsl(67, 79%, 50%) 50%, hsl(87, 85%, 45%) 75%, hsl(115, 86%, 40%) 100%);
  background-position-x: 100%;
  background-repeat: no-repeat;
  background-size: 100% 1000%;
  box-shadow: inset 2px 2px 3px hsla(0, 0%, 0%, .75);
  -webkit-appearance: none;

  ::-webkit-slider-thumb {
    width: 14px;
    height: 11px;
    -webkit-appearance: none;
    border: 1px solid black;
    border-radius: 2px;
    background-color: hsl(201, 16%, 72%);
    background-image: linear-gradient(90deg, black 0%, black 20%, hsl(212, 17%, 58%) 20%, hsl(212, 17%, 58%) 40%, black 40%, black 60%, hsl(212, 17%, 58%) 60%, hsl(212, 17%, 58%) 80%, black 80%, black 100%);
    background-position: 3px 3px;
    background-repeat: no-repeat;
    background-size: 5px 3px;
    box-shadow:
      inset -1px -1px 0 hsl(214, 9%, 48%),
      inset 1px 1px 0 hsl(191, 28%, 89%),
      inset -2px -2px 0 hsl(212, 17%, 58%);
  }

  :focus {
    outline: none;
  }
`
