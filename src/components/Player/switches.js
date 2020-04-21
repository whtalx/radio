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

  useEffect(
    () => {
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

const Sh = styled(Switch)`
  width: 47px;
  height: 15px;
  margin-top: 1px;
  position: relative;

  :after, svg {
    top: 4px;
  }

  :active:after, :active svg {
    top: 5px;
  }
`

export const Shuffle = ({ random, setRandom }) => {
  return (
    <Sh active={ random } onClick={ setRandom }>
      <svg width="29px" height="5px" viewBox="0 0 29 5" fillRule="evenodd">
        <path d="M3 0H0V3H2V4H0V5H3V2H1V1H3V0ZM5 0H4V5H5V3H7V5H8V0H7V2H5V0ZM9 4V0H10V4H12V0H13V4H12V5H10V4H9ZM14 0V5H15V3H17V2H15V1H17V0H14ZM21 0H18V5H19V3H21V2H19V1H21V0ZM23 0H22V5H25V4H23V0ZM29 0H26V5H29V4H27V3H29V2H27V1H29V0Z" />
      </svg>
    </Sh>
  )
}

const Fa = styled(Switch)`
  width: 27px;
  height: 15px;
  margin-top: 1px;
  position: relative;

  :after, svg {
    top: 4px;
  }

  :active:after, :active svg {
    top: 5px;
  }
`

export const Favorite = ({ favourite, setFavourite }) => {
  return (
    <Fa active={ favourite } onClick={ setFavourite }>
      <svg width="7px" height="6px" viewBox="0 0 7 6" fillRule="evenodd">
        <path d="M0 1H7V3H5V5H2V3H0ZM1 0H3V2H4V0H6V4H4V6H3V4H1V0Z" fill="black" />
      </svg>
    </Fa>
  )
}
