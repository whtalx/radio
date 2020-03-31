import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Window from './components/Window'
import './index.css'


window.webAudio = new AudioContext()

ReactDOM.render(
  <Router><Route component={ Window } /></Router>,
  document.getElementById('root')
)
