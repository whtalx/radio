import { BrowserWindow, screen } from 'electron'

import {
  makeURL,
  onShow,
  onHide,
  onMoved,
  onClosed,
  onResized,
  onRestore,
  onMinimize,
  onceReadyToShow,
} from '.'

export function createWindow() {
  global.player = new BrowserWindow({
    width: 324,
    height: 133,
    show: false,
    frame: false,
    movable: true,
    minWidth: 324,
    minHeight: 133,
    maxHeight: 133,
    resizable: true,
    hasShadow: false,
    transparent: true,
    maximizable: false,
    acceptFirstMouse: true,
    backgroundColor: `#00000000`,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      // nodeIntegrationInWorker: true,
    },
  })

  global.player.loadURL(makeURL())
  global.player.on(`show`, onShow)
  global.player.on(`hide`, onHide)
  global.player.on(`moved`, onMoved)
  global.player.on(`closed`, onClosed)
  global.player.on(`resized`, onResized)
  global.player.on(`restore`, onRestore)
  global.player.on(`minimize`, onMinimize)
  global.player.once(`ready-to-show`, onceReadyToShow)

  if (process.platform === `win32`) {
    global.player.on(`enter-full-screen`, () => {
      const [width, height] = global.player.getSize()
      const bounds = screen.getPrimaryDisplay().bounds
      const onLeave = () => global.player.setContentSize(width, height)
      global.player.setContentSize(bounds.width, bounds.height)
      global.player.once(`leave-full-screen`, onLeave)
    })
  }
}
