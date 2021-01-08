import osLocale from 'os-locale'

export async function getSystemLocale() {
  const locale = await osLocale()
  locale && global.player.webContents.send(`locale`, locale)
}
