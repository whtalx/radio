export function control(func) {
  return (_, name) => {
    global[name] && global[name][func] && global[name][func]()
  }
}
