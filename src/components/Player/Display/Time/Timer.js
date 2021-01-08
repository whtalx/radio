import { WIDTH, HEIGHT } from './constants'

export default function Timer(canvas, sprite) {
  const context = canvas.getContext(`2d`)
  const POSITIONS = [0, 13, 26, 44, 57]
  const { width, height } = canvas

  function wx(value) {
    return value * width / WIDTH
  }

  function hy(value) {
    return value * height / HEIGHT
  }

  function draw(digit, position) {
    context.drawImage(sprite, digit * 26, 0, 26, 40, wx(POSITIONS[position]), 0, wx(13), hy(20))
  }

  function clrScr() {
    context.clearRect(0, 0, width, height)
    context.drawImage(sprite, 310, 0, 10, 40, wx(38), 0, wx(5), hy(20)) // * -- colon
  }

  function render(time) {
    clrScr()
    if (!Number.isFinite(time)) return

    const m = Math.floor(time / 60)
    const minutes = `0${ m }`.slice(m < 100 ? -2 : -3)
    const seconds = `0${ time - m * 60 }`.slice(-2)

    if (minutes.length === 3) {
      draw(minutes[0], 0)
      draw(minutes[1], 1)
      draw(minutes[2], 2)
    } else {
      draw(10, 0)
      draw(minutes[0], 1)
      draw(minutes[1], 2)
    }

    draw(seconds[0], 3)
    draw(seconds[1], 4)
  }

  function empty() {
    clrScr()
    draw(10, 0) // * -- hyphen
    draw(11, 1) // * -- empty digit
    draw(11, 2)
    draw(11, 3)
    draw(11, 4)
  }

  return {
    render,
    empty,
  }
}
