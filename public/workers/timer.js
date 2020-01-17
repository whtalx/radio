const tick = (message = null) => postMessage(message)
let timer = null

onmessage = ({ data: { type } }) => {
  clearInterval(timer)

  switch (type) {
    case `start`:
    case `continue`: {
      tick()
      timer = setInterval(tick, 1000)
      return
    }

    case `stop`: {
      tick(`ы`)
      return
    }

    default:
      return
  }
}
