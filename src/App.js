import React, { useEffect, useReducer } from 'react'
import { ipcRenderer } from 'electron'
import { ThemeProvider } from 'styled-components'

import Window from './components/Window'

import reducer, { initialState, State, Dispatch } from './reducer'
import Localise, { i18n } from './i18n'

import theme from './themes/default.json'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { locale } = state.window

  function setLocale(_, data = '') {
    dispatch({ type: `setLocale`, payload: data.substr(0, 2) })
  }

  function setSettings(_, data) {
    dispatch({ type: `setSettings`, payload: data })
  }

  useEffect(
    () => {
      ipcRenderer.on(`locale`, setLocale)
      ipcRenderer.on(`settings`, setSettings)
    },
    []
  )

  return (
    <Dispatch.Provider value={ dispatch }>
      <State.Provider value={ state }>
        <Localise.Provider value={ i18n(locale) }>
          <ThemeProvider theme={ theme }>
            <Window />
          </ThemeProvider>
        </Localise.Provider>
      </State.Provider>
    </Dispatch.Provider>
  )
}
