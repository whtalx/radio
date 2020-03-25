import styled from 'styled-components'

export const Wrapper = styled.div`
  height: ${ ({ h }) => Number.isFinite(h) ? `${ h }px` : h };
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-flow: column;
  background-color: hsl(240, 18%, 27%);
  border: 1px solid hsl(240, 100%, 3%);
  box-shadow: inset 1px 1px 2px hsl(204, 29%, 80%);
  -webkit-app-region: drag;
`

export const Frame = styled.div`
  width: 267px;
  height: calc(100% - 16px);
  position: absolute;
  left: 3px;
  top: 11px;
  box-sizing: border-box;
  border-width: 2px 1px 1px 2px;
  border-style: solid;
  border-color: hsl(240, 100%, 3%);
  box-shadow:
    inset 1px 1px 0 hsl(204, 29%, 80%),
    1px 1px 2px hsl(204, 29%, 80%);
`

export const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(
      163.19deg,
      hsla(240, 100%, 3%, .24) -1.39%,
      hsla(240, 100%, 3%, .65) 17.27%,
      hsla(240, 100%, 3%, .56) 30.95%,
      hsla(240, 100%, 3%, 0) 55.54%,
      hsla(240, 100%, 3%, .37) 80.43%,
      hsla(240, 100%, 3%, .71) 99.69%
    );
`

export const Spacer = styled.div`
  flex-grow: 1.1;
  height: 7px;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid #0A0D16;
  background:
    linear-gradient(
      180deg,
      hsl(58, 64%, 67%) 20.61%,
      hsl(0, 0%, 100%) 34.75%,
      hsl(47, 17%, 16%) 51.12%,
      hsl(61, 33%, 42%) 67.11%,
      hsl(58, 64%, 67%) 78.65%
    );
`

export const Title = styled.div`
  width: 265px;
  height: 7px;
  position: absolute;
  left: 4px;
  top: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-transform: uppercase;
  font-size: 9px;
  font-weight: 800;
  color: hsl(0, 0%, 100%);
  -webkit-app-region: drag;

  button {
    margin-left: 3px;
    padding: 0;
    width: 7px;
    height: 7px;
    border: 0;
    -webkit-app-region: no-drag;

    :focus {
      outline: 0;
    }

    :active {
      outline: 1px solid hsl(55, 28%, 53%);
    }
  }

  ${ Spacer }:nth-child(1) {
    flex-grow: ${ ({ buttons }) => `1.${ buttons + 1 }` };
  }
`

export const Minimize = styled.button`
  border-radius: 3px;
  background:
    linear-gradient(
      180deg,
      hsl(38, 9%, 23%) 0%,
      hsl(57, 22%, 31%) 62.5%,
      hsl(143, 20%, 84%) 80%,
      hsl(163, 9%, 69%) 100%
    );
`

export const Close = styled.button`
  position: relative;
  background-color: hsl(47, 17%, 16%);

  :before,
  :after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(
        45deg,
        hsla(47, 17%, 16%, 0) 40%,
        hsl(55, 28%, 40%) 50%,
        hsla(47, 17%, 16%, 0) 60%
      );
  }

  :after {
    transform: rotate(90deg);
  }
`

export const Content = styled.div`
  width: 260px;
  height: auto;
  min-height: 114px;
  position: relative;
  left: 10px;
  top: 21px;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-app-region: no-drag;
`
