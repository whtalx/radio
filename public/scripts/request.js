import {
  abort,
  serve,
  resolve,
  makeRequest
} from '.'

export function request(_, data = {}, redirect) {
  abort()

  const { src_resolved, src } = data
  if (redirect) {
    console.log(`redirect:\n `, redirect)
    makeRequest({ url: redirect, callback: resolve({ url: redirect, data }) })
  } else if (src_resolved) {
    console.log(`fetching resolved:\n `, src_resolved)
    makeRequest({ url: src_resolved, callback: check(data) })
  } else if (src) {
    console.log(`fetching:\n `, src)
    makeRequest({ url: src, callback: resolve({ url: src, data }) })
  } else {
    console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
  }
}

function check(data) {
  const destroy = (response) => {
    response.destroy()
    global.stream = null
    global.request = null
    global.player.webContents.send(`rejected`, data)
  }

  return (response) => {
    const { statusCode } = response
    statusCode === 200
      ? serve(response)
      : destroy(response, data)
  }
}