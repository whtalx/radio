import { app, Menu, ipcMain } from 'electron'
import http from 'http'
import Store from 'electron-store'
import createWindow from './scripts/createWindow'
import request from './scripts/request'
import control from './scripts/control'
import abort from './scripts/abort'
import menu from './scripts/menu'

global.player = null
global.stream = null
global.request = null
global.session = null
global.server = http.createServer().listen(8520)
global.store = new Store({ serialize: JSON.stringify })

server.on('request', (request, response) => {
  if (global.stream) {
    global.stream.pipe(response)
  } else {
    response.statusCode = 503
    response.end()
  }
})
Menu.setApplicationMenu(Menu.buildFromTemplate(menu()))

app.commandLine.appendArgument(`disable-background-timer-throttling`)
app.on(`ready`, createWindow)
app.on(`window-all-closed`, () => process.platform !== `darwin` && app.quit())
app.on(`activate`, () => {
  global.player === null
    ? createWindow()
    : !global.player.isVisible() && global.player.show()
})

ipcMain.on(`abort`, abort)
ipcMain.on(`request`, request)
ipcMain.on(`close`, control`close`)
ipcMain.on(`minimize`, control`minimize`)
ipcMain.on(`hide`, control(process.platform === `darwin` ? `hide` : `close`))
