import isDev from'electron-is-dev'
import path from 'path'

export function makeURL() {
  return isDev
    ? `http://localhost:3000`
    : `file://${path.join(__dirname, `../index.html`)}`
}
