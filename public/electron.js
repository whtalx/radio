const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

installExtension(REDUX_DEVTOOLS)
installExtension(REACT_DEVELOPER_TOOLS)

let player
let list

const createPlayer = () => {
  player = new BrowserWindow({
    width: 275,
    height: 116,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    // hasShadow: false,
    // transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    show: false,
  })

  player.loadURL(isDev ? `http://localhost:3000?player` : `file://${ path.join(__dirname, `../build/index.html?player`) }`)

  player.webContents.openDevTools()

  player.once(`ready-to-show`, () => {
    player.show()
  })

  player.on(`closed`, () => {
    player = null
  })
}

const createList = () => {
  list = new BrowserWindow({
    width: 275,
    height: 550,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    parent: player,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    show: false,
  })

  list.loadURL(isDev ? `http://localhost:3000?list` : `file://${ path.join(__dirname, `../build/index.html?list`) }`)

  list.once(`ready-to-show`, () => {
    list.show()
  })

  list.on(`closed`, () => {
    list = null
  })
}

app.on(`ready`, () => {
  createPlayer()
  createList()
})

app.on(`window-all-closed`, () => {
  // if (process.platform !== `darwin`) app.quit()
  app.quit()
})

app.on(`activate`, () => {
  player === null && createWindow()
})
