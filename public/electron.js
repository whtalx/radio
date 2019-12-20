const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')

const { app, BrowserWindow } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
    // minWidth: 150,
    // minHeight: 32,
    // hasShadow: false,
    // transparent: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    show: false,
  })

  installExtension(REDUX_DEVTOOLS)
  installExtension(REACT_DEVELOPER_TOOLS)

  mainWindow.loadURL(isDev ? `http://localhost:3000` : `file://${ path.join(__dirname, `../build/index.html`) }`)

  mainWindow.webContents.openDevTools()

  mainWindow.once(`ready-to-show`, () => {
    mainWindow.show()
  })

  mainWindow.on(`closed`, () => {
    mainWindow = null
  })
}

app.on(`ready`, createWindow);

app.on(`window-all-closed`, () => {
  // if (process.platform !== `darwin`) app.quit()
  app.quit()
})

app.on(`activate`, () => {
  mainWindow === null && createWindow()
})
