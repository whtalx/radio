export function abort(shut = false) {
  console.log(`aborting previous request${ shut ? `, destroying stream` : `` }`)

  global.prefetch && global.prefetch.abort()
  global.prefetch = null

  if (shut) {
    global.stream && global.stream.destroy()
    global.request = null
  }
}
