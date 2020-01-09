import { app, BrowserWindow, Menu, ipcMain, screen, shell } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'

global.player = null

const control = ({ func, name }) => {
  global[name] && global[name][func] && global[name][func]()
}

const makeURL = () =>
  isDev
    ? `http://localhost:3000`
    : `file://${ path.join(__dirname, `../build/index.html`) }`

const createPlayer = () => {
  global.player = new BrowserWindow({
    height: 116,
    width: 275,
    acceptFirstMouse: true,
    maximizable: false,
    transparent: false,
    resizable: false,
    movable: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
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
  if (process.platform === 'win32') {
    global.player.on(`enter-full-screen`, () => {
      const [width, height] = global.player.getSize()
      const bounds = screen.getPrimaryDisplay().bounds
      global.player.setContentSize(bounds.width, bounds.height)
      global.player.once(`leave-full-screen`, () => global.player.setContentSize(width, height))
    })
  }
}

app.on(`ready`, () => {
  createPlayer()
})

app.on(`window-all-closed`, () => {
  app.quit()
})

app.on(`activate`, () => {
  global.player === null && createPlayer()
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
