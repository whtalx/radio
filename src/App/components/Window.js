import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { ipcRenderer } from 'electron'

const Window = styled.div`
  padding: 3px;
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
  box-shadow:
    inset 1px 1px 2px hsl(200, 20%, 80%);
`

const Title = styled.div`
  height: 9px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-app-region: drag;

  button {
    margin-left: 3px;
    padding: 0;
    width: 9px;
    height: 9px;
    -webkit-app-region: no-drag;
  }
`

const Content = styled.div`
  flex: 0 1 100%;
  height: auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: hsl(240, 100%, 3%);
  border-style: solid;
  border-width: 2px 1px 1px 2px;
  box-shadow:
    inset 1px 1px 2px hsl(200, 20%, 80%),
    1px 1px 2px hsl(200, 20%, 80%);
`

export default ({ buttons, children, title }) =>
  <Window>
    <Helmet>
      <title>
        { title }
      </title>
    </Helmet>
    <Title>
      { title }
      {
        buttons.map((button) =>
          <button
            key={ title + button }
            title={ button }
            onClick={() => ipcRenderer.send(button, title) }
          />
        )
      }
    </Title>
    <Content>
      { children }
    </Content>
  </Window>
