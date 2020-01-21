export default (func) => (_, name) => {
  global[name] && global[name][func] && global[name][func]()
}
