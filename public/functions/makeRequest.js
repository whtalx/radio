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

  global.request = options.protocol === `https:`
    ? https.request(options)
    : http.request(options)

  global.request.on(`error`, console.error)
  global.request.on(`socket`, onSocket)
  global.request.on(`response`, callback)
  global.request.end()
}
