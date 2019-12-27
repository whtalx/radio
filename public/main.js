import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron'
import keypress from 'electron-localshortcut'
import isDev from 'electron-is-dev'
import path from 'path'

global.player = null
global.list = null

const control = ({ func, name }) => {
  global[name] && global[name][func] && global[name][func]()
}

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
      const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require(`electron-devtools-installer`)
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
  global.list = new BrowserWindow({
    width: 275,
    height: 550,
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
    keypress.register(global.list, `Enter`, () => {
      global.list.webContents.send(`key`, `Enter`)
    })
  })

  global.list.on(`closed`, () => {
    keypress.unregister(global.list, `Enter`)
    global.list = null
  })
}

app.on(`ready`, () => {
  createPlayer()
  createList()
})

app.on(`window-all-closed`, () => {
  app.quit()
})

app.on(`activate`, () => {
  global.player === null && createPlayer()
})

ipcMain.on(`toggle-list`, () => {
  if (!global.list) {
    createList()
  } else if (global.list.isVisible()) {
    global.list.hide()
    return
  }

  const rect = global.player.getBounds()
  global.list.setBounds({ x: rect.x, y: rect.y + rect.height })
  global.list.show()
})

ipcMain.on(`close`, (e, name) => control({ func: `close`, name }))
ipcMain.on(`minimize`, (e, name) => control({ func: `minimize`, name }))
ipcMain.on(`hide`, (e, name) => control({ func: `hide`, name }))

if (process.platform === 'darwin') {
  const menu = [
    {
      label: `WebRadio`,
      submenu: [
        { role: `about` },
        {
          label: `Open GitHub repo`,
          click: async () => {
            await shell.openExternal(`https://github.com/whtalx/radio`)
          }
        },
        { type: `separator` },
        { role: `hide` },
        { role: `hideothers` },
        { role: `unhide` },
        { type: `separator` },
        { role: `quit` }
      ]
    },
    ...(isDev ? [{
      label: `View`,
      submenu: [
        { role: `reload` },
        { role: `forcereload` },
        { role: `toggledevtools` },
      ],
    }] : []),
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}
