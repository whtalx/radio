import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

global.player = null
global.list = null

const makeURL = (view) =>
  isDev
    ? `http://localhost:3000?${ view }`
    : `file://${ path.join(__dirname, `../build/index.html?${ view }`) }`

const createPlayer = () => {
  global.player = new BrowserWindow({
    width: 275,
    height: 116,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    acceptFirstMouse: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    backgroundColor: `#fff`,
    show: false,
  })

  global.player.loadURL(makeURL(`player`))

  global.player.once(`ready-to-show`, () => {
    if (isDev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')

      installExtension(REDUX_DEVTOOLS)
      installExtension(REACT_DEVELOPER_TOOLS)
    }

    global.player.show()
  })

  global.player.on(`closed`, () => {
    global.player = null
  })
}

const createList = () => {
  const rect = global.player.getBounds()

  global.list = new BrowserWindow({
    width: 275,
    height: 550,
    x: rect.x,
    y: rect.y + rect.height,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    acceptFirstMouse: true,
    enableLargerThanScreen: true,
    parent: player,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    backgroundColor: `#fff`,
    show: false,
  })

  global.list.loadURL(makeURL(`list`))


  global.list.once(`ready-to-show`, () => {
    list.show()
    // list.webContents.openDevTools()
  })

  global.list.on(`closed`, () => {
    global.list = null
  })
}


app.on(`ready`, () => {
  createPlayer()
  // createList()
})

app.on(`window-all-closed`, () => {
  // if (process.platform !== `darwin`) app.quit()
  app.quit()
})

app.on(`activate`, () => {
  global.player === null && createPlayer()
})

ipcMain.on(`toggle-list`, () => {
  global.list !== null
    ? global.list.close()
    : createList()
})
