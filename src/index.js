import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'

import Window from './components/Window'

import { register } from './serviceWorker'
import theme from './themes/default.json'
import './index.css'

ReactDOM.render(
  <ThemeProvider theme={ theme }>
    <Window />
  </ThemeProvider>,
  document.getElementById('root')
)

register()
