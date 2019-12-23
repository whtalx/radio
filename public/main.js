import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'
import store from '../src/store/main'

if (isDev) {
  const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')

  installExtension(REDUX_DEVTOOLS)
  installExtension(REACT_DEVELOPER_TOOLS)
}

let player
let list

const makeURL = (view) =>
  isDev
    ? `http://localhost:3000?${ view }`
    : `file://${ path.join(__dirname, `../build/index.html?${ view }`) }`

const createPlayer = () => {
  player = new BrowserWindow({
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

  player.loadURL(makeURL(`player`))

  // list = new BrowserView()
  // player.setBrowserView(list)
  // list.setBounds({ x: 0, y: 116, width: 275, height: 550 })
  // list.webContents.loadURL(makeURL(`list`))

  player.once(`ready-to-show`, () => {
    player.show()
  })

  player.on(`closed`, () => {
    player = null
  })
}

const createList = () => {
  const rect = player.getBounds()

  list = new BrowserWindow({
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

  list.loadURL(makeURL(`list`))


  list.once(`ready-to-show`, () => {
    list.show()
    // list.webContents.openDevTools()
  })

  list.on(`closed`, () => {
    list = null
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
  player === null && createPlayer()
})

ipcMain.on(`toggle-list`, () => {
  list
    ? list.close()
    : createList()
})

// let currentState

// store.subscribe(() => {
//   let oldState = currentState
//   currentState = store.getState()
//   console.log(JSON.stringify(oldState), JSON.stringify(currentState))
// })
