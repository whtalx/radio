import { app, screen } from 'electron'

import { createWindow, getSystemLocale, saveSettings } from '.'

import { PLAYER_HEIGHT, DRAWER_HEIGHT, WINDOW_MIN_WIDTH } from '../constants'

export function onActivate() {
  global.player === null
    ? createWindow()
    : !global.player.isVisible() && global.player.show()
}

export function onAllClosed() {
  process.platform !== `darwin` && app.quit()
}

export function onSaveSettings(_, data) {
  saveSettings(data)
}

export function onRequest(request, response) {
  if (global.stream && global.stream.pipe) {
    global.stream.pipe(response)
  } else {
    response.statusCode = 503
    response.end()
  }
}

export function onResized() {
  const { width, height } = global.player.getBounds()
  saveSettings({ bounds: { width, height } })
}

export function onMoved() {
  saveSettings({ position: global.player.getPosition() })
}

export function onClosed() {
  global.player = null
}

export function onShow() {
  global.player.webContents.send(`visible`)
}

export function onRestore() {
  global.player.webContents.send(`visible`)
}

export function onHide() {
  global.player.webContents.send(`invisible`)
}

export function onMinimize() {
  global.player.webContents.send(`invisible`)
}

export function onceReadyToShow() {
  function callback(_, data) {
    if (data.position) {
      const [x, y] = data.position
      global.player.setPosition(x, y)
      delete data.position
    }

    if (data.bounds) {
      const { width, height } = data.bounds
      const { workArea } = screen.getPrimaryDisplay()

      if (data.drawer) {
        global.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT + DRAWER_HEIGHT)
        global.player.setMaximumSize(workArea.width, workArea.height)
      } else {
        global.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT)
        global.player.setMaximumSize(workArea.width, PLAYER_HEIGHT)
      }
      global.player.setBounds({ width, height })
      delete data.bounds
    }

    if (!data.locale) {
      getSystemLocale()
    }

    global.player.webContents.send(`settings`, data)
    global.player.show()
  }

  global.storage.get(`settings`, callback)
}
