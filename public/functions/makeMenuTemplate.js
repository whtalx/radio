import { shell } from 'electron'
import isDev from 'electron-is-dev'

export function makeMenuTemplate() {
  const menu = [{
    label: `WebRadio`,
    submenu: [
      { role: `about` },
      {
        label: `Open GitHub repo`,
        click: async () => {
          await shell.openExternal(`https://github.com/whtalx/radio`)
        },
      },
      { type: `separator` },
      { role: `hide` },
      { role: `hideothers` },
      { role: `unhide` },
      { type: `separator` },
      { role: `quit` },
    ],
  }]

  isDev && menu.push(
    {
      label: `View`,
      submenu: [
        { role: `reload` },
        { role: `forcereload` },
        { role: `toggledevtools` },
      ],
    },
    {
      label: `Edit`,
      submenu: [
        {
          label: `Undo`,
          accelerator: `CmdOrCtrl+Z`,
          selector: `undo:`,
        },
        {
          label: `Redo`,
          accelerator: `Shift+CmdOrCtrl+Z`,
          selector: `redo:`,
        },
        { type: `separator` },
        {
          label: `Cut`,
          accelerator: `CmdOrCtrl+X`,
          selector: `cut:`,
        },
        {
          label: `Copy`,
          accelerator: `CmdOrCtrl+C`,
          selector: `copy:`,
        },
        {
          label: `Paste`,
          accelerator: `CmdOrCtrl+V`,
          selector: `paste:`,
        },
        {
          label: `Select All`,
          accelerator: `CmdOrCtrl+A`,
          selector: `selectAll:`,
        },
      ],
    },
  )

  return menu
}
