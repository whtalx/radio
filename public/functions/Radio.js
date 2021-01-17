import { app, Menu, ipcMain } from 'electron'
import storage from 'electron-json-storage'
import http from 'http'

import {
  Events,
  Request,
  Messages,
  createWindow,
  makeMenuTemplate,
} from '.'

storage.setDataPath(app.getPath('userData'))

export function Radio() {
  const self = {}
  self.storage = storage
  self.events = Events(self)
  self.request = Request(self)
  self.messages = Messages(self)
  self.sendMessage = sendMessage
  self.saveSettings = saveSettings
  self.server = http.createServer().listen()
  self.server.on(`request`, self.events.onRequest)

  Menu.setApplicationMenu(Menu.buildFromTemplate(makeMenuTemplate()))
  app.allowRendererProcessReuse = false
  app.commandLine.appendArgument(`disable-background-timer-throttling`)
  app.commandLine.appendSwitch(`disable-features`, `HardwareMediaKeyHandling`)
  app.commandLine.appendSwitch(`force-color-profile`, `generic-rgb`)
  app.on(`activate`, self.events.onActivate)
  app.on(`window-all-closed`, self.events.onAllClosed)
  app.whenReady().then(createWindow(self))

  ipcMain.on(`abort`, self.messages.abort)
  ipcMain.on(`request`, self.messages.request)
  ipcMain.on(`context`, self.messages.context)
  ipcMain.on(`control`, self.messages.control)
  ipcMain.on(`getHeight`, self.messages.getHeight)
  ipcMain.on(`setHeight`, self.messages.setHeight)
  ipcMain.on(`saveSettings`, self.messages.saveSettings)

  function sendMessage(...args) {
    self.player.webContents.send(...args)
  }

  function saveSettings(settings) {
    function callback(_, data) {

      for (const key in settings) {
        data[key] = settings[key]
      }

      self.storage.set(`settings`, data)
    }

    self.storage.get(`settings`, callback)
  }
}
