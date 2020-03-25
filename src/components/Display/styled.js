import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 93px;
  height: 42px;
  box-sizing: content-box;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 1px solid black;
`

export const Visualisation = styled.canvas`
  position: absolute;
  right: 3px;
  bottom: 6px;
  width: 79px;
  height: 19px;
`

export const Counter = styled.canvas`
  width: 63px;
  height: 13px;
  position: absolute;
  right: 4px;
  top: 3px;
`

export const Background = styled.svg`
  box-shadow: 1px 1px 0 hsl(217, 22%, 63%);
`

export const Group = styled.g`
  &.loading #paused,
  &.pending #paused,
  &.playing #paused {
    display: none;
  }

  &.paused #playing,
  &.paused #loading,
  &.paused #loaded {
    display: none;
  }

  &.loading,
  &.pending {
    #loading {
      fill: #FF2833;
    }

    #loaded {
      fill: #114033;
    }
  }
`
