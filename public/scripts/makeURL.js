import isDev from'electron-is-dev'
import path from 'path'

export default () =>
  isDev
    ? `http://localhost:3000`
    : `file://${ path.join(__dirname, `../build/index.html`) }`
