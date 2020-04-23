import { ipcRenderer } from 'electron'

export function control(command) {
  return () => ipcRenderer.send(`control`, command)
}
