import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column;
  background-color: hsl(240, 18%, 27%);
  border: 4px solid hsl(240, 100%, 3%);
  border-image: url('assets/b.png') 4;
`

export const Frame = styled.div`
  width: 267px;
  height: auto;
  border-width: 2px 1px 1px 2px;
  border-style: solid;
  border-color: hsl(240, 100%, 3%);
  box-shadow: inset 1px 1px 1px hsla(204, 29%, 80%, .3);
`

export const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(
      163.19deg,
      hsla(240,100%,3%,.24) 0%,
      hsla(240,100%,3%,.65) 15%,
      hsla(240,100%,3%,.56) 30%,
      hsla(240,100%,3%,0) 50%,
      hsla(240,100%,3%,.49) 66%,
      hsla(240,100%,3%,.65) 73%,
      hsla(240,100%,3%,.56) 87%,
      hsla(240, 100%, 3%, .24) 99%
    );
  background-position: 0 0;
  background-repeat: repeat-y;
  background-size: 100% 108px;
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
  width: 266px;
  height: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  text-transform: uppercase;
  font-size: 9px;
  font-weight: 800;
  line-height: 8px;
  color: hsl(0, 0%, 100%);
  -webkit-app-region: drag;

  button {
    margin-left: 3px;
    padding: 0;
    width: 7px;
    height: 7px;
    border: 0;
    -webkit-app-region: no-drag;
    z-index: 10;

    :focus {
      outline: 0;
    }

    :active {
      outline: 1px solid hsl(55, 28%, 53%);
    }
  }

  ${ Spacer }:nth-child(1) {
    flex-grow: 1.4;
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
  width: 267px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-flow: column;
`
