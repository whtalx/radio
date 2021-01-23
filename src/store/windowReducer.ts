import { ipcRenderer } from 'electron'

import { WindowState, ActionType } from '.'

export default function windowReducer(draft: WindowState, action: ActionType): void {
  switch (action.type) {
    case `setDrawer`: {
      const drawer = action.payload

      if (typeof drawer === 'boolean') {
        ipcRenderer.send(`setHeight`, drawer)
        ipcRenderer.send(`saveSettings`, { drawer })
        draft.drawer = drawer
      }

      break
    }

    case `setLocale`: {
      const locale = action.payload

      if (typeof locale === 'string') {
        draft.locale = locale
        ipcRenderer.send(`saveSettings`, { locale })
      }
      break
    }

    case `setSettings`: {
      if (typeof action.payload === 'object') {
        for (const key in action.payload) {
          draft[key] = action.payload[key]
        }
      }
      break
    }

    default:
      break
  }
}
