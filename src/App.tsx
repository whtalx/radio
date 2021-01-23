import React, { useEffect, useReducer } from 'react'
import { ThemeProvider } from 'styled-components'
import { ipcRenderer } from 'electron'

import Window from './components/Window'

import reducer, { WindowState, StateType, ActionType, initialState, StateContext, DispatchContext } from './store'
import Localise, { i18n } from './i18n'

import theme from './themes/default.json'

export default function App(): JSX.Element {
  const [state, dispatch]: [StateType, React.Dispatch<ActionType>] = useReducer(reducer, initialState)
  const { window: { locale } } = state

  function setLocale(_: any, data: string = ``) {
    dispatch({ type: `setLocale`, payload: data.substr(0, 2) })
  }

  function setSettings(_: any, data: WindowState) {
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
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <Localise.Provider value={i18n(locale)}>
          <ThemeProvider theme={theme}>
            <Window />
          </ThemeProvider>
        </Localise.Provider>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}
