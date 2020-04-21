import { BrowserWindow, screen } from 'electron'
import isDev from 'electron-is-dev'
import { makeURL } from './makeURL'

export function createWindow() {
  const [x, y] = global.store.get(`position`) || []

  global.player = createPlayer(x, y)
  global.player.on(`show`, () => global.player.webContents.send(`visible`))
  global.player.on(`restore`, () => global.player.webContents.send(`visible`))
  global.player.on(`hide`, () => global.player.webContents.send(`invisible`))
  global.player.on(`minimize`, () => global.player.webContents.send(`invisible`))
  global.player.once(`ready-to-show`, () => {
    if (isDev) {
      const { default: install, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require(`electron-devtools-installer`)
      install(REDUX_DEVTOOLS)
      install(REACT_DEVELOPER_TOOLS)
      require(`devtron`).install()
    }

    // global.player.show()
  })

  global.player.on(`close`, () => {
    global.store.set(`position`, global.player.getPosition())
  })

  global.player.on(`closed`, () => {
    global.player = null
  })

  if (process.platform === `win32`) {
    global.player.on(`enter-full-screen`, () => {
      const [width, height] = global.player.getSize()
      const bounds = screen.getPrimaryDisplay().bounds
      global.player.setContentSize(bounds.width, bounds.height)
      global.player.once(`leave-full-screen`, () => global.player.setContentSize(width, height))
    })
  }

  global.list = createList(x, y + 116)
}

function createPlayer(x, y) {
  const player = new BrowserWindow({
    width: 275,
    height: 116,
    x,
    y,
    backgroundColor: `#000`,
    acceptFirstMouse: true,
    maximizable: false,
    transparent: false,
    resizable: false,
    movable: true,
    frame: false,
    show: false,
    webPreferences: {
      // nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  player.loadURL(makeURL(`player`))
  return player
}

function createList(x, y) {
  const list = new BrowserWindow({
    width: 275,
    height: 509,
    x,
    y,
    backgroundColor: `#000`,
    acceptFirstMouse: true,
    maximizable: false,
    transparent: false,
    resizable: false,
    movable: true,
    frame: false,
    show: false,
    // parent: global.player,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  list.loadURL(makeURL(`list`))
  return list
}
