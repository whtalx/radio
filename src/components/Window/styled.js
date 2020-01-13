import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 3px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  background-image:
    linear-gradient(
      315deg,
      hsl(240, 33%, 9%) 0%,
      hsl(240, 31%, 16%) 5%,
      hsl(240, 32%, 20%) 10%,
      hsl(240, 20%, 28%) 40%,
      hsl(240, 20%, 28%) 60%,
      hsl(240, 32%, 20%) 90%,
      hsl(240, 31%, 16%) 95%,
      hsl(240, 33%, 9%) 100%
    );
  border: 1px solid black;
  box-shadow: inset 1px 1px 2px hsl(200, 20%, 80%);
  -webkit-app-region: drag;

  & > :not(:first-child) {
    -webkit-app-region: no-drag;
  }
`

export const Title = styled.div`
  height: 9px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: hsl(0, 0%, 100%);
  -webkit-app-region: drag;

  button {
    margin-left: 3px;
    padding: 0;
    width: 9px;
    height: 9px;
    -webkit-app-region: no-drag;
  }
`

export const Content = styled.div`
  padding: 3px;
  height: auto;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  border-color: hsl(240, 100%, 3%);
  border-style: solid;
  border-width: 2px 1px 1px 2px;
  box-shadow:
    inset 1px 1px 2px hsl(200, 20%, 80%),
    1px 1px 2px hsl(200, 20%, 80%);
`
