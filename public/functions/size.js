const { screen } = require('electron')

export function size(type) {
  switch (type) {
    case `getHeight`:
      return e => e.reply(`height`, global.player.getBounds().height)

    case `setHeight`:
      return (_, list, player) => {
        const { workArea } = screen.getPrimaryDisplay()

        if (list !== 0) {
          global.player.setMinimumSize(324, player + 250)
          global.player.setMaximumSize(workArea.width, workArea.height)
          global.player.setBounds({ height: player + list })
        } else {
          global.player.setMinimumSize(324, player)
          global.player.setMaximumSize(workArea.width, player)
          global.player.setBounds({ height: player })
        }
      }

    default:
      return x => void x
  }
}
