import { app, BrowserWindow, Menu, ipcMain, net, screen, shell } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'
import resolve from './scripts/resolve'

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
    // if (isDev) {
    //   const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require(`electron-devtools-installer`)
    //   installExtension(REDUX_DEVTOOLS)
    //   installExtension(REACT_DEVELOPER_TOOLS)
    // }

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

// if (process.platform === 'darwin') {
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
// }

ipcMain.on(`close`, (_, name) => control({ func: `close`, name }))
ipcMain.on(`minimize`, (_, name) => control({ func: `minimize`, name }))
ipcMain.on(`hide`, (_, name) => control({ func: `hide`, name }))
ipcMain.on(`fetch`, fetch)

function fetch(_, data, recursive) {
  const { src } = data || {}

  if (!src) {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
    return
  }

  const url = recursive || src
  console.log(`fetching:\n `, url)

  const send = (c, m) => {
    global.player.webContents.send(c, m)
  }

  const recurse = (link) => {
    fetch(undefined, data, link)
  }

  const request = net.request(url)
  request.setHeader(`Icy-MetaData`, `1`)
  request.on(`error`, console.error)
  request.on(`response`, resolve({ url, data, send, recurse }))
  request.end()
}
