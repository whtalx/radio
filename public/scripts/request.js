import { net } from 'electron'
import resolve from './resolve'
import serve from './serve'
import abort from './abort'

export default (_, data = {}, recursive) => {
  const { src_resolved, src } = data
  if (src_resolved) {
    global.request = net.request({ url: src_resolved, partition: `sess` })
    global.request.setHeader(`Icy-MetaData`, `1`)
    global.request.on(`error`, console.error)
    global.request.on(`response`, serve)
    global.request.end()
  } else if (src) {
    global.request && abort()
    const url = recursive || src
    console.log(`fetching:\n `, url)
    global.request = net.request({ url, partition: `sess` })
    global.request.setHeader(`Icy-MetaData`, `1`)
    global.request.on(`error`, console.error)
    global.request.on(`response`, resolve({ url, data }))
    global.request.end()
  } else {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
  }
}
