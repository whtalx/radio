export function control(_, command) {
  const c = command === `close`
    ? process.platform === `darwin`
      ? `hide`
      : `close`
    : command

    global.player[c] && global.player[c]()
}
