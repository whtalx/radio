import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import playerStore from './store/player'
import listStore from './store/list'
import Window from './components/Window'
import Player from './components/Player'
import List from './components/List'
import './index.css'

const views = {
  player: {
    component: <Player />,
    store: playerStore,
    title: `WebRadio`,
    buttons: [`minimize`, `close`],
  },
  list: {
    component: <List />,
    store: listStore,
    title: `WebRadio Stations`,
    buttons: [`hide`],
  },
}

const App = ({ location }) => {
  const name = location.search.substr(1)
  const view = views[name]
  return !view
    ? null
    : <Window name={ name } title={ view.title } buttons={ view.buttons }>
      <Provider store={ view.store }>
        { view.component }
      </Provider>
    </Window>
}

ReactDOM.render(
    <BrowserRouter>
      <Route path={ `/` } component={ App } />
    </BrowserRouter>,
  document.getElementById('root')
)
