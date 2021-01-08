import React, { useContext } from 'react'

import { State, Dispatch } from '../../../reducer'
import Localise from '../../../i18n'

import { Wrapper } from './styled'

export default function Settings() {
  const state = useContext(State)
  const dispatch = useContext(Dispatch)
  const localise = useContext(Localise)

  function setLocale({ target: { value } }) {
    dispatch({ type: `setLocale`, payload: value })
  }

  function renderInput(locale) {
    return (
      <input
        type="radio"
        name="locale"
        value={ locale }
        onChange={ setLocale }
        defaultChecked={ locale === state.window.locale }
      />
    )
  }

  return (
    <Wrapper>
      <legend>{ localise(`language`) }</legend>
      <label>
        { renderInput(`en`) }
        English
      </label>
      <label>
        { renderInput(`ru`) }
        Русский
      </label>
    </Wrapper>
  )
}
