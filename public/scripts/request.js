import { net } from 'electron'
import http from 'http'
import https from 'https'
import URL from 'url'
import resolve from './resolve'
import serve from './serve'
import abort from './abort'

const onSocket = (socket) => {
  // const HTTP = Buffer.from(`HTTP/1.0`)

  socket.ondata = (chunk) => {
    if (/icy/i.test(chunk.slice(0, 3))) {
      console.log(`got ICY response!`)
      // const buffer = Buffer.from(new Array(chunk.length + HTTP.length - 3))
      // let i = 0
      // i += HTTP.copy(buffer)
      // i += chunk.copy(buffer, i, 3)
      // assert.equal(i, buffer.length)
      return Buffer.from(`HTTP/1.0${ chunk.slice(3) }`)
      // socket._wasIcy = true
      // } else {
      //   socket._wasIcy = false
    }

    return chunk
  }

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

  // global.request = net.request({ url, partition: `sess` })
  // global.request.setHeader(`User-Agent`, `WinampMPEG/2.6`)
  // global.request.setHeader(`Accept`, `*/*`)
  // global.request.setHeader(`Icy-MetaData`, `1`)
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
