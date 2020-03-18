import { StreamReader } from '.'

export function serve(stream) {
  if (stream.headers[`icy-metaint`]) {
    console.log(`serving radio stream with meta tags`)
    global.stream = new StreamReader(stream.headers[`icy-metaint`])

    global.stream.on(`metadata`, (metadata) => {
      global.player.webContents.send(`metadata`, metadata)
    })

    stream.pipe(global.stream)
  } else {
    console.log(`serving radio stream without meta tags`)
    global.stream = stream
  }

  global.player.webContents.send(`served`, global.server.address().port)
}
