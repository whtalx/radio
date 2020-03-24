export function size(type) {
  switch (type) {
    case `getSizeList`:
      return e => e.reply(`sizeList`, global.player.getSize())

    case `getSizeVideo`:
      return e => e.reply(`sizeVideo`, global.player.getSize())

    case `setSize`:
      return (_, size) => global.player.setSize(...size)

    default:
      return () => void 0
  }
}
