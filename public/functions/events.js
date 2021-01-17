import { app, screen } from 'electron'

import { createWindow, getSystemLocale } from '.'

import { PLAYER_HEIGHT, DRAWER_HEIGHT, WINDOW_MIN_WIDTH } from '../constants'

export function Events(self) {
  function onRequest(_, response) {
    if (self.stream && self.stream.pipe) {
      self.stream.pipe(response)
    } else {
      response.statusCode = 503
      response.end()
    }
  }

  function onActivate() {
    !self.player
      ? createWindow()
      : !self.player.isVisible() && self.player.show()
  }

  function onAllClosed() {
    process.platform !== `darwin` && app.quit()
  }

  function onResized() {
    const { width, height } = self.player.getBounds()
    self.saveSettings({ bounds: { width, height } })
  }

  function onMoved() {
    self.saveSettings({ position: self.player.getPosition() })
  }

  function onClosed() {
    delete self.player
  }

  function onShow() {
    self.sendMessage(`visible`)
  }

  function onRestore() {
    self.sendMessage(`visible`)
  }

  function onHide() {
    self.sendMessage(`invisible`)
  }

  function onMinimize() {
    self.sendMessage(`invisible`)
  }

  function onceReadyToShow() {
    function callback(_, data) {
      if (data.position) {
        const [x, y] = data.position
        self.player.setPosition(x, y)
        delete data.position
      }

      if (data.bounds) {
        const { width, height } = data.bounds
        const { workArea } = screen.getPrimaryDisplay()

        if (data.drawer) {
          self.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT + DRAWER_HEIGHT)
          self.player.setMaximumSize(workArea.width, workArea.height)
        } else {
          self.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT)
          self.player.setMaximumSize(workArea.width, PLAYER_HEIGHT)
        }

        self.player.setBounds({ width, height })
        delete data.bounds
      }

      if (!data.locale) {
        getSystemLocale(self)
      }

      self.sendMessage(`settings`, data)
      self.player.show()
    }

    self.storage.get(`settings`, callback)
  }

  function onEnterFullScreen() {
    const [width, height] = self.player.getSize()
    const bounds = screen.getPrimaryDisplay().bounds

    function onceLeaveFullScreen() {
      self.player.setContentSize(width, height)
    }

    self.player.setContentSize(bounds.width, bounds.height)
    self.player.once(`leave-full-screen`, onceLeaveFullScreen)
  }

  return {
    onHide,
    onShow,
    onMoved,
    onClosed,
    onRequest,
    onRestore,
    onResized,
    onMinimize,
    onActivate,
    onAllClosed,
    onceReadyToShow,
    onEnterFullScreen,
  }
}
