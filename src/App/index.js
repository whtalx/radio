import React from 'react'
import List from './windows/List'
import Player from './windows/Player'

export default ({ location }) => {
  switch(location.search.substr(1)) {
    case `player`:
      return <Player />

    case `list`:
      return <List />

    default:
      return null
  }
}
