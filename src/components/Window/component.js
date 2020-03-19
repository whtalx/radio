import React, { useEffect } from 'react'
import { remote, ipcRenderer } from 'electron'
import { Wrapper, Title, Content, Frame, Shadow, Spacer, Close, Minimize } from './styled'
import Player from '../Player'
import List from '../List'

export default ({ list, listToggle }) => {
  useEffect(
    () => {
      const rect = remote.getCurrentWindow().getBounds()
      if ((rect.height < 500 && !list) || (rect.height > 500 && list)) return
      remote.getCurrentWindow().setBounds({
        ...rect,
        height: list ? rect.height + 509 : rect.height - 509,
      })
    },
    [list]
  )


  const windows = [
    window({
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
    }),
  ]

  list && windows.push(window({
      key: `list_window`,
      title: `Stations`,
      height: 509,
      buttons: [
        <Close
          key={ `list_close` }
          title={ `close` }
          onClick={ listToggle }
        />,
      ],
      children: <List />,
    }))

  return windows
}

function window({ key, title, height, buttons, children }) {
  return (
    <Wrapper key={ key } h={ height }>
      <Frame />
      <Shadow />
      <Title>
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