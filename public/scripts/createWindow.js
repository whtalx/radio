import { BrowserWindow, screen } from "electron"
import isDev from 'electron-is-dev'
import makeURL from './makeURL'

export default () => {
  const [x, y] = global.store.get(`position`) || []
  global.player = new BrowserWindow({
    width: 275,
    height: 116,
    x,
    y,
    backgroundColor: `#000`,
    acceptFirstMouse: true,
    maximizable: false,
    transparent: false,
    resizable: false,
    movable: true,
    frame: false,
    show: false,
    webPreferences: {
      // nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  global.player.loadURL(makeURL(`player`))
  global.player.on(`show`, () => global.player.webContents.send(`visible`))
  global.player.on(`restore`, () => global.player.webContents.send(`visible`))
  global.player.on(`hide`, () => global.player.webContents.send(`invisible`))
  global.player.on(`minimize`, () => global.player.webContents.send(`invisible`))
  global.player.once(`ready-to-show`, () => {
    if (isDev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require(`electron-devtools-installer`)
      installExtension(REDUX_DEVTOOLS)
      installExtension(REACT_DEVELOPER_TOOLS)
    }

    global.player.show()
  })

  global.player.on(`close`, () => {
    store.set(`position`, global.player.getPosition())
  })

  global.player.on(`closed`, () => {
    global.player = null
  })

  if (process.platform === `win32`) {
    global.player.on(`enter-full-screen`, () => {
      const [width, height] = global.player.getSize()
      const bounds = screen.getPrimaryDisplay().bounds
      global.player.setContentSize(bounds.width, bounds.height)
      global.player.once(`leave-full-screen`, () => global.player.setContentSize(width, height))
    })
  }
}
