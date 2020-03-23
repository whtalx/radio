import React, { useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import { Wrapper, Title, Content, Frame, Shadow, Spacer, Close, Minimize } from './styled'
import Player from '../Player'
import List from '../List'

export default ({ list, listToggle }) => {
  const listVisible = useRef(list)

  useEffect(
    () => {
      ipcRenderer.on('sizeList', (e, [width, height]) => {
        ((height < 500 && listVisible.current) || (height > 500 && !listVisible.current)) &&
        ipcRenderer.send(`setSize`, [width, listVisible.current ? height + 509 : height - 509])
      })
    },
    []
  )

  useEffect(
    () => {
      listVisible.current !== list && ipcRenderer.send(`getSizeList`)
      listVisible.current = list
      console.log(listVisible.current);
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