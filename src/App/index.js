import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import List from './components/List'
import Player from './components/Player'
import Header from './components/Header'
import Visualization from './components/Visualization'

const Views = ({ location }) => {
  switch(location.search.substr(1)) {
    case `player`:
      return <Player />

    case `list`:
      return (
        <div>
          <Header />
          <Visualization />
          <List />
        </div>
      )

    default:
      return null
  }
}

export default () =>
  <Router>
    <Route path={ `/` } component={ Views }/>
  </Router>
