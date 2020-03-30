export function size(type) {
  switch (type) {
    case `getSizeList`:
      return e => e.reply(`sizeList`, global.player.getSize())

    case `getSizeVideo`:
      return e => e.reply(`sizeVideo`, global.player.getSize())

    case `setSize`:
      return (_, size) => {
        const [width, height] = size
        global.player.setBounds({ width, height })
      }

    default:
      return () => void 0
  }
}
