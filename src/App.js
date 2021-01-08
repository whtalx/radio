import React, { useReducer } from 'react'
import { ThemeProvider } from 'styled-components'

import Window from './components/Window'

import reducer, { initialState, State, Dispatch } from './reducer'
import theme from './themes/default.json'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Dispatch.Provider value={ dispatch }>
      <State.Provider value={ state }>
        <ThemeProvider theme={ theme }>
          <Window />
        </ThemeProvider>
      </State.Provider>
    </Dispatch.Provider>
  )
}
