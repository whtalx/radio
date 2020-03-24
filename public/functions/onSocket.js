export function onSocket(socket) {
  let listeners
  const substitute = (chunk) =>
    /icy/i.test(chunk.slice(0, 3))
      ? Buffer.from(chunk.toString().replace(/icy/i, `HTTP/1.0`))
      : chunk

  const onData = (chunk) => {
    socket.removeListener(`data`, onData)

    listeners.forEach((listener) => {
      socket.on(`data`, listener)
    })

    listeners = null
    socket.emit(`data`, substitute(chunk))
  }

  listeners = socket.listeners(`data`)
  socket.removeAllListeners(`data`)
  socket.on(`data`, onData)
}
