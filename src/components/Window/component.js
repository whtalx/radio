import React, { useEffect, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import { Helmet } from 'react-helmet'
import { Wrapper, Title, Content } from './styled'
import Player from '../Player'
import List from '../List'

export default ({ list }) => {
  const [buttons] = useState([`minimize`, `close`])
  const [title] = useState(`WebRadio`)
  const [name] = useState(`player`)

  useEffect(
    () => {
      const rect = remote.getCurrentWindow().getBounds()
      if (rect.height < 500 && !list) return
      remote.getCurrentWindow().setBounds({
        ...rect,
        height: list ? rect.height + 509 : rect.height - 509,
      })
    },
    [list]
  )

  return (
    <Wrapper>
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
              onClick={() => ipcRenderer.send(button, name) }
            />
          )
        }
      </Title>
      <Content>
        <Player />
      </Content>
      { list && <Content><List /></Content>}
    </Wrapper>
  )
}
