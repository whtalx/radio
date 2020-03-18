export function Timer() {
  const self = {}
  let timer = null

  const tick = (message = null) =>
    self.onmessage && self.onmessage(message)

  self.postMessage = ({ type }) => {
    switch (type) {
      case `start`:
      case `continue`: {
        timer = setInterval(tick, 1000)
        tick()
        return
      }

      case `stop`: {
        clearInterval(timer)
        timer = null
        tick(`ы`)
        return
      }

      default:
        return
    }
  }

  return self;
}