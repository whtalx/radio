import isDev from'electron-is-dev'
import path from 'path'

export function makeURL(window) {
  const location = window === `player` ? `` : `?${ window }`
  return isDev
    ? `http://localhost:3000${ location }`
    : `file://${path.join(__dirname, `../index.html${ location }`)}`
}
