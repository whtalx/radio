import URL from 'url'
import http from 'http'
import https from 'https'
import serve from './serve'
import abort from './abort'
import resolve from './resolve'

const onSocket = (socket) => {
  let listeners
  const substitute = (chunk) =>
    /icy/i.test(chunk.slice(0, 3))
      ? Buffer.from(chunk.toString().replace(/icy/i, `HTTP/1.0`))
      : chunk

  const ondata = (chunk) => {
    socket.removeListener('data', ondata)

    listeners.forEach((listener) => {
      socket.on('data', listener)
    })

    listeners = null
    socket.emit('data', substitute(chunk))
  }

  listeners = socket.listeners(`data`)
  socket.removeAllListeners(`data`)
  socket.on('data', ondata)
}

const makeRequest = ({ url, callback }) => {
  if (!url || !callback) return
  const options = URL.parse(url)

  options.headers = {
    'User-Agent': `WinampMPEG/2.6`,
    'Accept': `*/*`,
    'Icy-MetaData': `1`,
  }

  global.request = options.protocol === `https:`
    ? https.request(options)
    : http.request(options)

  global.request.on(`error`, console.error)
  global.request.on(`socket`, onSocket)
  global.request.on(`response`, callback)
  global.request.end()
}

export default (_, data = {}, recursive) => {
  const { src_resolved, src } = data
  if (src_resolved) {
    makeRequest({ url: src_resolved, callback: serve })
  } else if (src) {
    global.request && abort()
    const url = recursive || src
    console.log(`fetching:\n `, url)
    makeRequest({ url, callback: resolve({ url, data }) })
  } else {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
  }
}
