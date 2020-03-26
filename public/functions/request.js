import {
  abort,
  resolve,
  makeRequest
} from '.'

export function request(_, data = {}, redirect) {
  global.prefetch && abort()

  const { src_resolved, src, hls } = data
  if (redirect) {
    console.log(`redirect:\n\t${ redirect }`)
    makeRequest({ url: redirect, callback: resolve({ url: redirect, data }) })
  } else if (src_resolved) {
    const url = hls || src_resolved
    console.log(`fetching resolved:\n\t${ url }`)
    makeRequest({ url, callback: resolve({ url, data }) })
  } else if (src) {
    console.log(`fetching:\n\t${ src }`)
    makeRequest({ url: src, callback: resolve({ url: src, data }) })
  } else {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
  }
}
