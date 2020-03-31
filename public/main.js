import { app, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import http from 'http'
import {
  createWindow,
  toggleList,
  request,
  control,
  context,
  abort,
  menu,
  size,
} from './functions'

global.player = null
global.stream = null
global.request = null
global.prefetch = null
global.server = http.createServer().listen()
global.store = new Store({ serialize: JSON.stringify })

global.server.on(`request`, (request, response) => {
  if (global.stream && global.stream.pipe) {
    global.stream.pipe(response)
  } else {
    response.statusCode = 503
    response.end()
  }
})

Menu.setApplicationMenu(Menu.buildFromTemplate(menu()))

app.allowRendererProcessReuse = false
app.commandLine.appendArgument(`disable-background-timer-throttling`)
app.whenReady().then(createWindow)
app.on(`window-all-closed`, () => process.platform !== `darwin` && app.quit())
app.on(`activate`, () =>
  global.player === null
    ? createWindow()
    : !global.player.isVisible() && global.player.show()
)

ipcMain.on(`abort`, abort)
ipcMain.on(`request`, request)
ipcMain.on(`context`, context)
ipcMain.on(`close`, control(`close`))
ipcMain.on(`setSize`, size(`setSize`))
ipcMain.on(`minimize`, control(`minimize`))
ipcMain.on(`getSizeList`, size(`getSizeList`))
ipcMain.on(`getSizeVideo`, size(`getSizeVideo`))
ipcMain.on(`ping`, (e, m) => e.reply(`pong`, m))
ipcMain.on(`hide`, control(process.platform === `darwin` ? `hide` : `close`))
ipcMain.on(`list`, (_, data) => data && global.list.once(`ready-to-show`, () => global.list.show()))
ipcMain.on(`toggle_list`, toggleList)
