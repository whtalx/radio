import { ipcRenderer } from 'electron'

export default function windowReducer(draft, action) {
  switch (action.type) {
    case `setDrawer`: {
      const drawer = action.payload
      ipcRenderer.send(`setHeight`, drawer)
      ipcRenderer.send(`saveSettings`, { drawer })
      draft.drawer = drawer
      break
    }

    case `setLocale`: {
      draft.locale = action.payload
      ipcRenderer.send(`saveSettings`, { locale: action.payload })
      break
    }

    case `setSettings`: {
      for (const key in action.payload) {
        draft[key] = action.payload[key]
      }
      break
    }

    default:
      break
  }
}
