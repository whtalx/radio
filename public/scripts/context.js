import { Menu, MenuItem } from 'electron'

export function context(e, menus) {
  const menu = new Menu()

  menus.forEach(({ label, enabled = true }) =>
    menu.append(new MenuItem({
      label,
      enabled,
      click: () => e.reply(`context`, label),
    }))
  )

  menu.popup({ window: global.player })
}
