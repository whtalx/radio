export function Timer(canvas) {
  const self = {}
  const context = canvas.getContext(`2d`)
  const { width, height } = canvas
  const wx = (n) => n * width / 63
  const hx = (n) => n * height / 13

  function rect(x, y, w, h) {
    context.fillRect(wx(x), hx(y), wx(w), hx(h))
  }

  function dot(x, y) {
    rect(x, y, 1, 1)
  }

  function digit(figure, position) {
    const x = [0, 12, 24, 42, 54][position]
    const top = () => rect(x + 1, 0, 7, 1)
    const middle = () => rect(x + 1, 6, 7, 1)
    const bottom = () => rect(x + 1, 12, 7, 1)
    const leftTop = () => rect(x, 1, 1, 5)
    const leftBottom = () => rect(x, 7, 1, 5)
    const rightTop = () => rect(x + 8, 1, 1, 5)
    const rightBottom = () => rect(x + 8, 7, 1, 5)

    switch (figure) {
      case `0`: {
        top()
        leftTop()
        rightTop()
        dot(x, 6)
        dot(x + 8, 6)
        bottom()
        leftBottom()
        rightBottom()
        return
      }

      case `1`: {
        dot(x + 8, 0)
        rightTop()
        dot(x + 8, 6)
        rightBottom()
        dot(x + 8, 12)
        return
      }

      case `2`: {
        top()
        rightTop()
        middle()
        leftBottom()
        bottom()
        return
      }

      case `3`: {
        top()
        rightTop()
        middle()
        rightBottom()
        bottom()
        return
      }

      case `4`: {
        dot(x, 0)
        leftTop()
        dot(x + 8, 0)
        rightTop()
        middle()
        dot(x + 8, 6)
        rightBottom()
        dot(x + 8, 12)
        return
      }

      case `5`: {
        top()
        leftTop()
        middle()
        rightBottom()
        bottom()
        return
      }

      case `6`: {
        top()
        leftTop()
        middle()
        dot(x, 6)
        leftBottom()
        rightBottom()
        bottom()
        return
      }

      case `7`: {
        dot(x, 0)
        top()
        rightTop()
        dot(x + 8, 6)
        rightBottom()
        dot(x + 8, 12)
        return
      }

      case `8`: {
        top()
        leftTop()
        rightTop()
        middle()
        leftBottom()
        rightBottom()
        bottom()
        return
      }

      case `9`: {
        top()
        leftTop()
        rightTop()
        middle()
        dot(x + 8, 6)
        rightBottom()
        bottom()
        return
      }

      default:
        return
    }
  }

  self.clrScr = () => {
    context.fillStyle = `hsl(120, 100%, 34%)`
    context.clearRect(0,0, width, height)
    rect(36, 4, 3, 1)
    rect(36, 8, 3, 1)
  }

  self.tick = (time) => {
    self.clrScr()
    if (!Number.isFinite(time)) return

    context.fillStyle = `hsl(120, 100%, 42%)`

    const m = Math.floor(time / 60)
    const minutes = `0${ m }`.slice(m < 100 ? -2 : -3)
    const seconds = `0${time - m * 60}`.slice(-2)

    if (minutes.length === 3) {
      digit(minutes[0], 0)
      digit(minutes[1], 1)
      digit(minutes[2], 2)
    } else {
      digit(minutes[0], 1)
      digit(minutes[1], 2)
    }

    digit(seconds[0], 3)
    digit(seconds[1], 4)
  }

  self.clrScr()
  return self
}
