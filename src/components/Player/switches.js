import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Switch } from './styled'
import { ipcRenderer } from 'electron'

const PL = styled(Switch)`
  width: 23px;
  height: 12px;
  position: absolute;
  left: 231px;
  top: 36px;
`

export const Playlist = () => {
  const [active, setActive] = useState(JSON.parse(localStorage.list || `{}`).visible)

  useEffect(() => {
    window.addEventListener(`storage`, () => {
      setActive(JSON.parse(localStorage.list || `{}`).visible)
    })
  },
  []
  )

  function toggle() {
    ipcRenderer.send(`toggle_list`)
  }

  return (
    <PL active={ active } onClick={ toggle }>
      <svg viewBox="0 0 7 5" width="7px" height="5px" fillRule="evenodd">
        <path d="M0 0h3v3h-2v2h-1v-5ZM1 1h1v1h-1v-1ZM4 0h1v4h2v1h-3v-5Z" />
      </svg>
    </PL>
  )
}

const EQ = styled(Switch)`
  width: 23px;
  height: 12px;
  position: absolute;
  left: 208px;
  top: 36px;
`

export const Equaliser = () =>
  <EQ>
    <svg viewBox="0 0 8 5" width="8px" height="5px" fillRule="evenodd">
      <path d="M3 0v1h-3v3h3v1h-2v-2h2v-1h-2v-2h2ZM4 1h4v2h-2v2h-1v-5h2v5h1v-1h-4v-3Z" />
    </svg>
  </EQ>
