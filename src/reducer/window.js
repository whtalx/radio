import { ipcRenderer } from 'electron'

export default function windowReducer(draft, action) {
  switch (action.type) {
    case `toggleDrawer`: {
      const drawer = !draft.drawer
      ipcRenderer.send(`setHeight`, drawer ? 484 : 0, 133)
      draft.drawer = drawer
      break
    }

    case `setLocale`: {
      draft.locale = action.payload
      break
    }

    default:
      break
  }
}
