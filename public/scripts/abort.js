export default () => {
  console.log(`aborting previous request`)
  global.request && global.request.abort()
  global.request = null
  global.stream = null
}
