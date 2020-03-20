import { Writable } from 'stream'
import { StreamReader } from '.'

export function serve(stream) {
  global.stream && global.stream.destroy()
  global.stream = null

  if (stream.headers[`icy-metaint`]) {
    console.log(`serving radio stream with meta tags`)
    global.stream = new StreamReader(stream.headers[`icy-metaint`])

    global.stream.on(`metadata`, (metadata) => {
      global.player.webContents.send(`metadata`, metadata)
    })

  } else {
    console.log(`serving radio stream without meta tags`)
    global.stream = new Writable()
  }

  stream.pipe(global.stream)
  global.player.webContents.send(`served`, global.server.address().port)
}
