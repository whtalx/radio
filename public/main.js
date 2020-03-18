import { app, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import http from 'http'
import {
  createWindow,
  request,
  control,
  abort,
  menu,
} from './scripts'

global.player = null
global.stream = null
global.request = null
global.session = null
global.server = http.createServer().listen(0, () => console.log('Serving on port ' + global.server.address().port))
global.store = new Store({ serialize: JSON.stringify })

global.server.on(`request`, (request, response) => {
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
app.on(`activate`, () =>
  global.player === null
    ? createWindow()
    : !global.player.isVisible() && global.player.show()
)

ipcMain.on(`abort`, abort)
ipcMain.on(`request`, request)
ipcMain.on(`close`, control`close`)
ipcMain.on(`minimize`, control`minimize`)
ipcMain.on(`hide`, control(process.platform === `darwin` ? `hide` : `close`))
