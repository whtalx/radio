import { createContext } from 'react'

import en from './en.json'
import ru from './ru.json'

interface Translation {
  [index: string]: Object;
}

type LocaliseContextType = (a: string) => string

const translations: Translation = { en, ru }

export default createContext<LocaliseContextType>(x => x)

export function i18n(locale: string) {
  const translation = translations[locale] || translations.en

  function reducePath(all: any, key: any, index: number, path: Array<string>) {
    return typeof all === `object`
      ? typeof all[key] === `object`
        ? index === path.length - 1
          ? key
          : all[key]
        : all[key]
      : all
  }

  return function localise(...args: string[]): string {
    return [...args].reduce(reducePath, translation)
  }
}
