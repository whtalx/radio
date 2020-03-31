import React from 'react'
import { ipcRenderer } from 'electron'
import { Wrapper, Title, Content, Frame, Shadow, Spacer, Close, Minimize } from './styled'
import Player from '../Player'
import List from '../List'

export default ({ location }) => {
  const win = location.search.substr(1) || `player`
  return makeWindow(win)
}

function makeWindow(name) {
  switch (name) {
    case `player`:
      return render({
        key: `player_window`,
        title: `WebRadio`,
        height: `auto`,
        buttons: [
          <Minimize
            key={ `player_minimize` }
            title={ `minimize` }
            onClick={ control(`minimize`) }
          />,
          <Close
            key={ `player_close` }
            title={ `close` }
            onClick={ control(`hide`) }
          />,
        ],
        children: <Player />,
      })

    case `list`:
      return render({
        key: `list_window`,
        title: `Stations`,
        height: 509,
        buttons: [
          <Close
            key={ `list_close` }
            title={ `close` }
            onClick={ () => ipcRenderer.send(`toggle_list`) }
          />,
        ],
        children: <List />,
      })

    default:
      return null
  }
}

function render({ key, title, height, buttons, children }) {
  return (
    <Wrapper key={ key } h={ height }>
      <Frame />
      <Shadow />
      <Title buttons={ buttons.length }>
        <Spacer />
        &nbsp;{ title }&nbsp;
        <Spacer />
        { buttons }
      </Title>
      <Content>
        {  children }
      </Content>
    </Wrapper>
  )
}

function control(command, window = `player`) {
  return () => ipcRenderer.send(command, window)
}