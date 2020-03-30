export function Timer(canvas) {
  const self = {}
  const digits = new Image()
  const context = canvas.getContext(`2d`)
  const { width, height } = canvas
  const wx = (n) => n * width / 63
  const hx = (n) => n * height / 13
  context.fillStyle = `hsl(120, 100%, 34%)`
  digits.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAANAQMAAAAT7esOAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAAA1QBZKIiVAAAAAXRSTlMAQObYZgAAAEVJREFUCNdjqGeIP/+C++fff/X2DQwNDQ4KEjxMDIwNBxzI5MSff/779x/GevsDQE4CgwAHGxMjUAlZHJDbHnD/BJnWAAC54zENL7Sk6QAAAABJRU5ErkJggg==`

  function rect(x, y, w, h) {
    context.fillRect(wx(x), hx(y), wx(w), hx(h))
  }

  function draw(digit, position) {
    context.drawImage(digits, digit * 9, 0, 9, 13, wx([0, 12, 24, 42, 54][position]), 0, wx(9), hx(13))
  }

  self.clrScr = () => {
    context.clearRect(0,0, width, height)
    rect(36, 4, 3, 1)
    rect(36, 8, 3, 1)
  }

  self.tick = (time) => {
    self.clrScr()
    if (!Number.isFinite(time)) return

    const m = Math.floor(time / 60)
    const minutes = `0${ m }`.slice(m < 100 ? -2 : -3)
    const seconds = `0${time - m * 60}`.slice(-2)

    if (minutes.length === 3) {
      draw(minutes[0], 0)
      draw(minutes[1], 1)
      draw(minutes[2], 2)
    } else {
      draw(minutes[0], 1)
      draw(minutes[1], 2)
    }

    draw(seconds[0], 3)
    draw(seconds[1], 4)
  }

  self.clrScr()
  return self
}
