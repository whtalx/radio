import osLocale from 'os-locale'

export async function getSystemLocale(self) {
  const locale = await osLocale()
  locale && self.sendMessage(`locale`, locale)
}
