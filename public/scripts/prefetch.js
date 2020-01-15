import { net } from 'electron'
import resolve from './resolve'

export default (_, data, recursive) => {
  const { src } = data || {}

  if (!src) {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
    return
  }

  if (global.request) {
    console.log(`aborting previous global.request`)
    global.request.abort()
    global.request = null
  }

  const url = recursive || src
  console.log(`fetching:\n `, url)

  global.request = net.request(url)
  global.request.setHeader(`Icy-MetaData`, `1`)
  global.request.on(`error`, console.error)
  global.request.on(`response`, resolve({ url, data }))
  global.request.end()
}
