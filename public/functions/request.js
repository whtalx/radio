import {
  abort,
  serve,
  resolve,
  makeRequest
} from '.'

export function request(_, data = {}, redirect) {
  global.prefetch && abort()

  const { src_resolved, src } = data
  if (redirect) {
    console.log(`redirect:\n\t${ redirect }`)
    makeRequest({ url: redirect, callback: resolve({ url: redirect, data }) })
  } else if (src_resolved) {
    console.log(`fetching resolved:\n\t${ src_resolved }`)
    makeRequest({ url: src_resolved, callback: check(data) })
  } else if (src) {
    console.log(`fetching:\n\t${ src }`)
    makeRequest({ url: src, callback: resolve({ url: src, data }) })
  } else {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
  }
}

function check(data) {
  return (response) => {
    if (response.statusCode === 200) {
      global.request = global.prefetch
      global.prefetch = null
      serve(response)
    } else {
      response.destroy()
      global.prefetch = null
      global.player.webContents.send(`rejected`, data)
    }
  }
}