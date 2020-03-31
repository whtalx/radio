export function toggleList() {
  global.list.webContents.send(`toggle_list`)
  if (global.list.isVisible()) {
    global.list.hide()
  } else {
    const { x, y, height } = global.player.getBounds() || {}
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(height)) {
      global.list.setBounds({ x, y: y + height })
      global.list.show()
    }
  }
}