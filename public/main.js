import { app, Menu, ipcMain } from 'electron'
import storage from 'electron-json-storage'
import http from 'http'

import {
  menu,
  size,
  abort,
  request,
  control,
  context,
  onRequest,
  onActivate,
  onAllClosed,
  createWindow,
  onSaveSettings,
} from './functions'

storage.setDataPath(app.getPath('userData'))
global.storage = storage
global.player = null
global.stream = null
global.request = null
global.prefetch = null
global.server = http.createServer().listen()

global.server.on(`request`, onRequest)
Menu.setApplicationMenu(Menu.buildFromTemplate(menu()))
app.allowRendererProcessReuse = false
app.commandLine.appendArgument(`disable-background-timer-throttling`)
app.commandLine.appendSwitch(`disable-features`, `HardwareMediaKeyHandling`)
app.commandLine.appendSwitch(`force-color-profile`, `generic-rgb`)
app.on(`activate`, onActivate)
app.on(`window-all-closed`, onAllClosed)
app.whenReady().then(createWindow)

ipcMain.on(`abort`, abort)
ipcMain.on(`request`, request)
ipcMain.on(`context`, context)
ipcMain.on(`control`, control)
ipcMain.on(`saveSettings`, onSaveSettings)
ipcMain.on(`getHeight`, size(`getHeight`))
ipcMain.on(`setHeight`, size(`setHeight`))
