import { app, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import http from 'http'
import {
  createWindow,
  request,
  control,
  context,
  abort,
  size,
  menu,
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
app.commandLine.appendSwitch(`disable-features`, `HardwareMediaKeyHandling`)
app.commandLine.appendSwitch(`force-color-profile`, `generic-rgb`)
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
ipcMain.on(`control`, control)
ipcMain.on(`getHeight`, size(`getHeight`))
ipcMain.on(`setHeight`, size(`setHeight`))
