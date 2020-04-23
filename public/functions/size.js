export function size(type) {
  switch (type) {
    case `getHeight`:
      return e => e.reply(`height`, global.player.getBounds().height)

    case `setHeight`:
      return (_, list, player) => {
        if (list !== 0) {
          global.player.resizable = true
          global.player.setMinimumSize(275, player + 116)
          global.player.setBounds({ height: player + list })
        } else {
          global.player.resizable = false
          global.player.setMinimumSize(275, player)
          global.player.setBounds({ height: player })
        }
      }

    default:
      return x => void x
  }
}
