import { Menu, MenuItem, screen } from 'electron'

import { PLAYER_HEIGHT, DRAWER_HEIGHT, WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT } from '../constants'

export function Messages(self) {
  function saveSettings(_, settings) {
    self.saveSettings(settings)
  }

  function getHeight(event) {
    event.reply(`height`, self.player.getBounds().height)
  }

  function setHeight(_, drawer) {
    const { workArea } = screen.getPrimaryDisplay()

    if (drawer) {
      self.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT + DRAWER_HEIGHT)
      self.player.setMaximumSize(workArea.width, workArea.height)
      self.player.setBounds({ height: WINDOW_MIN_HEIGHT })
    } else {
      self.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT)
      self.player.setMaximumSize(workArea.width, PLAYER_HEIGHT)
      self.player.setBounds({ height: PLAYER_HEIGHT })
    }

    const { width, height } = self.player.getBounds()
    self.saveSettings({ width, height })
  }

  function control(_, data) {
    const command = data === `close`
      ? process.platform === `darwin`
        ? `hide`
        : `close`
      : data

    typeof self.player[command] === `function` && self.player[command]()
  }

  function context(event, menus) {
    const menu = new Menu()

    menus.forEach(({ label, enabled = true }) =>
      menu.append(new MenuItem({
        label,
        enabled,
        click: () => event.reply(`context`, label),
      }))
    )

    menu.popup({ window: self.player })
  }

  function request(_, data) {
    self.request.make(data)
  }

  function abort(_) {
    self.request.abort(true)
  }

  return {
    abort,
    request,
    context,
    control,
    getHeight,
    setHeight,
    saveSettings,
  }
}