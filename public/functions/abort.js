export function abort(shut = false) {
  console.log(`aborting previous request${ shut ? `, destroying stream` : `` }`)
  shut && global.stream && global.stream.destroy()
  global.request && global.request.abort()
  global.request = null
}
