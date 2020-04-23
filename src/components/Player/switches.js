import React from 'react'
import styled from 'styled-components'

import { Switch } from './styled'
import { ReactComponent as PlIcon } from '../../icons/PL.svg'
import { ReactComponent as ShuffleIcon } from '../../icons/shuffle.svg'
import { ReactComponent as FavouriteIcon } from '../../icons/favourite.svg'

const Pl = styled(Switch)`
  width: 23px;
  height: 12px;
  position: absolute;
  left: 231px;
  top: 36px;
`

export const Playlist = ({ visible, toggleVisible }) => {
  return (
    <Pl active={ visible } onClick={ toggleVisible }>
      <PlIcon />
    </Pl>
  )
}

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
      <ShuffleIcon />
    </Sh>
  )
}

const Fa = styled(Switch)`
  width: 27px;
  height: 15px;
  margin-top: 1px;
  position: relative;

  svg {
    fill: black;
  }

  :after {
    top: 4px;
  }

  :active:after {
    top: 5px;
  }
`

export const Favorite = ({ favourite, setFavourite }) => {
  return (
    <Fa active={ favourite } onClick={ setFavourite }>
      <FavouriteIcon />
    </Fa>
  )
}
