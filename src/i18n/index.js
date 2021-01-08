import { createContext } from 'react'

import en from './en.json'
import ru from './ru.json'

const translations = { en, ru }

export default createContext({ localise: x => x })

export function i18n(locale) {
  const translation = translations[locale] || translations.en

  function reducePath(all, key, index, path) {
    return typeof all === `object`
      ? typeof all[key] === `object`
        ? index === path.length - 1
          ? key
          : all[key]
        : all[key]
      : all
  }

  return function localise(...args) {
    return [...args].reduce(reducePath, translation)
  }
}
