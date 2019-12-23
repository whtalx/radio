import React from 'react'
import List from './components/List'
import Player from './components/Player'

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
