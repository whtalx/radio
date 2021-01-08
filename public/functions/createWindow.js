import { BrowserWindow, screen } from 'electron'
import { makeURL } from './makeURL'

export function createWindow() {
  const [x, y] = global.store.get(`position`) || []

  global.player = new BrowserWindow({
    x,
    y,
    width: 324,
    height: 133,
    minWidth: 324,
    minHeight: 133,
    maxHeight: 133,
    backgroundColor: `#00000000`,
    acceptFirstMouse: true,
    maximizable: false,
    transparent: true,
    hasShadow: false,
    resizable: true,
    movable: true,
    frame: false,
    show: false,
    webPreferences: {
      // nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  global.player.loadURL(makeURL())
  global.player.on(`show`, () => global.player.webContents.send(`visible`))
  global.player.on(`restore`, () => global.player.webContents.send(`visible`))
  global.player.on(`hide`, () => global.player.webContents.send(`invisible`))
  global.player.on(`minimize`, () => global.player.webContents.send(`invisible`))
  global.player.once(`ready-to-show`, () => {
    global.player.show()
  })

  global.player.on(`close`, () => {
    global.store.set(`position`, global.player.getPosition())
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
