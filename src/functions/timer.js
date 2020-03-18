export function Timer() {
  const self = {}
  const tick = (message = null) => self.onmessage(message)

  let timer = null

  self.onmessage = o => void o

  self.postMessage = ({ type }) => {
    switch (type) {
      case `start`:
      case `continue`: {
        tick()
        timer = setInterval(tick, 1000)
        return
      }

      case `stop`: {
        clearInterval(timer)
        tick(`ы`)
        return
      }

      default:
        return
    }
  }

  return self;
}