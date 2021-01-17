import { BrowserWindow } from 'electron'

import { makeURL } from '.'

const WINDOW_CONFIG = {
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
}

export function createWindow(self) {
  return function callback() {
    self.player = new BrowserWindow(WINDOW_CONFIG)
    self.player.loadURL(makeURL())
    self.player.on(`show`, self.events.onShow)
    self.player.on(`hide`, self.events.onHide)
    self.player.on(`moved`, self.events.onMoved)
    self.player.on(`closed`, self.events.onClosed)
    self.player.on(`resized`, self.events.onResized)
    self.player.on(`restore`, self.events.onRestore)
    self.player.on(`minimize`, self.events.onMinimize)
    self.player.once(`ready-to-show`, self.events.onceReadyToShow)

    if (process.platform === `win32`) {
      self.player.on(`enter-full-screen`, self.events.onEnterFullScreen)
    }
  }
}
