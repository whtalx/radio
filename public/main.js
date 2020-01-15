import { app, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import createWindow from './scripts/createWindow'
import prefetch from './scripts/prefetch'
import control from './scripts/control'
import menu from './scripts/menu'

global.player = null
global.request = null
global.store = new Store({ serialize: value => JSON.stringify(value) })

Menu.setApplicationMenu(Menu.buildFromTemplate(menu()))

app.on(`ready`, createWindow)
app.on(`window-all-closed`, () => process.platform !== 'darwin' && app.quit())
app.on(`activate`, () => {
  global.player === null
    ? createWindow()
    : !global.player.isVisible() && global.player.show()
})

ipcMain.on(`minimize`, (_, name) => control({ func: `minimize`, name }))
ipcMain.on(`close`, (_, name) => control({ func: `close`, name }))
ipcMain.on(`hide`, (_, name) => control({ func: `hide`, name }))
ipcMain.on(`fetch`, prefetch)
