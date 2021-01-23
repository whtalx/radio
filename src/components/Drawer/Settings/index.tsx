import React, { useContext } from 'react'

import { StateContext, DispatchContext } from '../../../store'
import Localise from '../../../i18n'

import { Wrapper } from './styled'

function Language({ locale }: { locale: string }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  function setLocale(event: React.ChangeEvent<HTMLInputElement>) {
    const { target: { value } } = event
    dispatch({ type: `setLocale`, payload: value })
  }

  return (
    <input
      type="radio"
      name="locale"
      value={locale}
      onChange={setLocale}
      defaultChecked={locale === state.window.locale}
    />
  )
}

export default function Settings() {
  const localise = useContext(Localise)

  return (
    <Wrapper>
      <legend>{localise(`language`)}</legend>
      <label>
        <Language locale="en" />
        English
      </label>
      <label>
        <Language locale="ru" />
        Русский
      </label>
    </Wrapper>
  )
}
