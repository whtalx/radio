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
  margin-left: 5px;
  width: 245px;
  height: ${ props => props.sourceHeight || 8 }px;
  box-sizing: content-box;
  border-top-color: hsl(240, 100%, 3%);
  border-left-color: hsl(240, 100%, 3%);
  border-right-color: hsl(240, 18%, 27%);
  border-bottom-color: hsl(240, 18%, 27%);
  border-style: solid;
  border-width: 2px 1px 1px 3px;

  :fullscreen {
    border: none;

    ::-webkit-media-controls {
      display: none !important;
    }
  }
`

export const Controls = styled.div`
  padding: 6px 0 0 5px;
  height: 28px;
  display: flex;
  flex-flow: row nowrap;
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
    border-radius: 1px;
    background-color: hsl(201, 16%, 72%);
    background-image: linear-gradient(
      90deg,
      black 0%,
      black 20%,
      hsl(212, 17%, 58%) 20%,
      hsl(212, 17%, 58%) 40%,
      black 40%,
      black 60%,
      hsl(212, 17%, 58%) 60%,
      hsl(212, 17%, 58%) 80%,
      black 80%,
      black 100%
    );
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

  :active {
    ::-webkit-slider-thumb {
      background-color: black;
      border-color: black;//hsl(210, 13%, 94%) hsl(212, 12%, 58%) hsl(212, 12%, 58%) hsl(210, 13%, 94%);
      background-image: linear-gradient(
        90deg,
        white 0%,
        white 20%,
        black 20%,
        black 40%,
        white 40%,
        white 60%,
        black 60%,
        black 80%,
        white 80%,
        white 100%
      );
      box-shadow:
        inset -1px 0 0 black,
        inset -2px -1px 0 hsl(212, 12%, 58%),
        inset 1px 1px 0 hsl(210, 13%, 94%);
    }
  }
`

export const Switch = styled.button`
  -webkit-font-smoothing: none;
  box-sizing: border-box;
  border-color: hsl(0, 0%, 15%) hsl(210, 50%, 6%) hsl(210, 50%, 6%) hsl(0, 0%, 15%);
  border-style: solid;
  border-width: 1px;
  background-color: hsl(180, 5%, 69%);
  box-shadow:
    inset 1px 1px hsl(240, 4%, 56%),
    inset -1px -1px hsl(180, 9%, 18%),
    inset 2px 0 hsl(180, 5%, 63%),
    inset 0 -2px hsl(180, 3%, 47%),
    inset 3px 2px hsl(0, 0%, 87%);

  :focus {
    outline: 0;
  }

  svg {
    position: absolute;
    left: 10px;
    top: 3px;
    fill: hsl(240, 5%, 37%);
  }

  :after {
    content: '';
    width: 4px;
    height: 3px;
    box-sizing: border-box;
    position: absolute;
    left: 4px;
    top: 3px;
    background-color: ${ ({ active }) => active ? `hsl(118, 100%, 48%)` : `hsl(109, 100%, 18%)` };
    border-color: hsl(180, 5%, 34%) hsl(24, 9%, 82%) hsl(24, 9%, 82%) hsl(180, 5%, 34%);
    border-style: solid;
    border-width: 1px;
  }

  :active {
    background-color: hsl(240, 4%, 50%);
    box-shadow:
      inset 1px 1px hsl(240, 33%, 5%),
      inset -1px 0 hsl(0, 0%, 13%),
      inset 2px 2px hsl(180, 5%, 37%),
      inset 3px 0 hsl(240, 4%, 54%),
      inset 4px 3px hsl(0, 0%, 65%);

    svg {
      left: 11px;
      top: 4px;
      fill: black;
    }

    :after {
      left: 5px;
      top: 4px;
      border-color: black hsl(180, 5%, 69%) hsl(180, 5%, 69%) black;
    }
  }
`

export const Button = styled.button`
  padding: 0;
  position: relative;
  box-sizing: padding-box;
  border: 0;
  background-color: hsl(180, 5%, 69%);
  box-shadow:
    inset 1px 1px hsl(240, 4%, 56%),
    inset -1px -1px hsl(180, 9%, 18%),
    inset 2px 0 hsl(180, 5%, 63%),
    inset 0 -2px hsl(180, 3%, 47%),
    inset 3px 2px hsl(0, 0%, 87%);

  :focus {
    outline: 0;
  }

  svg {
    position: absolute;

    .dark {
      fill: hsl(300, 20%, 8%);
    }

    .light {
      fill: hsl(180, 50%, 94%);
    }

    .fill {
      fill: hsl(240, 5%, 65%);
    }

    .fill-dark {
      fill: hsl(240, 5%, 40%);
    }

    .shadow {
      fill: hsl(210, 7%, 58%);
    }
  }

  :active {
    background-color: hsl(240, 4%, 50%);
    box-shadow:
      inset 1px 1px hsl(240, 33%, 5%),
      inset -1px 0 hsl(0, 0%, 13%),
      inset 2px 2px hsl(180, 5%, 37%),
      inset 3px 0 hsl(240, 4%, 54%),
      inset 4px 3px hsl(0, 0%, 65%);

    svg {
      .dark {
        fill: hsl(0, 0%, 0%);
      }

      .light {
        fill: hsl(180, 5%, 66%);
      }

      .fill {
        fill: hsl(180, 4%, 40%);
      }

      .fill-dark {
        fill: hsl(240, 5%, 31%);
      }

      .shadow {
        fill: hsl(210, 7%, 35%);
      }
    }
  }
`
