import abort from './abort'
import serve from './serve'
import resolve from './resolve'
import makeRequest from './makeRequest'

export default (_, data = {}, redirect) => {
  global.request && abort()

  const { src_resolved, src } = data
  if (redirect) {
    console.log(`redirect:\n `, redirect)
    makeRequest({ url: redirect, callback: resolve({ url: redirect, data }) })
  } else if (src_resolved) {
    console.log(`fetching resolved:\n `, src_resolved)
    makeRequest({ url: src_resolved, callback: serve })
  } else if (src) {
    console.log(`fetching:\n `, src)
    makeRequest({ url: src, callback: resolve({ url: src, data }) })
  } else {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
  }
}
