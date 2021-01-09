import { screen } from 'electron'

import { saveSettings } from '.'

import { PLAYER_HEIGHT, DRAWER_HEIGHT, WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT } from '../constants'

export function size(type) {
  switch (type) {
    case `getHeight`:
      return e => e.reply(`height`, global.player.getBounds().height)

    case `setHeight`:
      return (_, drawer) => {
        const { workArea } = screen.getPrimaryDisplay()

        if (drawer) {
          global.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT + DRAWER_HEIGHT)
          global.player.setMaximumSize(workArea.width, workArea.height)
          global.player.setBounds({ height: WINDOW_MIN_HEIGHT })
        } else {
          global.player.setMinimumSize(WINDOW_MIN_WIDTH, PLAYER_HEIGHT)
          global.player.setMaximumSize(workArea.width, PLAYER_HEIGHT)
          global.player.setBounds({ height: PLAYER_HEIGHT })
        }

        const { width, height } = global.player.getBounds()
        saveSettings(undefined, { bounds: { width, height } })
      }

    default:
      return x => void x
  }
}
