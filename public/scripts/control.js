export default ({ func, name }) => {
  global[name] && global[name][func] && global[name][func]()
}
