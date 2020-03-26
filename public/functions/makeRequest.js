import URL from 'url'
import http from 'http'
import https from 'https'
import { onSocket } from '.'

export function makeRequest({ url, callback }) {
  if (!url || !callback) return

  const options = URL.parse(url)
  options.followAllRedirects = false
  options.headers = {
    'User-Agent': `WinampMPEG/2.6`,
    'Accept': `*/*`,
    'Icy-MetaData': `1`,
  }

  global.prefetch = options.protocol === `https:`
    ? https.request(options)
    : http.request(options)

  global.prefetch.on(`error`, ({ message }) => {
    callback({
      statusCode: Infinity,
      statusMessage: message,
      socket: { on: o => void o },
      destroy: o => void o,
    })
  })
  global.prefetch.on(`socket`, onSocket)
  global.prefetch.on(`response`, callback)
  global.prefetch.end()
}
