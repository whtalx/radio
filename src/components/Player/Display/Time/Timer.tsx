export interface TimerInterface {
  render: (x?: number) => void;
  empty: () => void;
}

export default function Timer(canvas: HTMLCanvasElement, sprite: CanvasImageSource): TimerInterface {
  const context = canvas.getContext(`2d`)!
  const POSITIONS = [0, 13, 26, 44, 57]
  const { width, height } = canvas

  function wx(value: number) {
    return value * devicePixelRatio
  }

  function hy(value: number) {
    return value * devicePixelRatio
  }

  function draw(digit: number | string, position: number) {
    const offset = typeof digit === 'string' ? parseInt(digit, 10) : digit
    context.drawImage(sprite, offset * 26, 0, 26, 40, wx(POSITIONS[position]), 0, wx(13), hy(20))
  }

  function clrScr(withClolon = true, activeClolon = true) {
    context.clearRect(0, 0, width, height)
    withClolon && context.drawImage(sprite, activeClolon ? 312 : 322, 0, 10, 40, wx(39), 0, wx(5), hy(20)) // colon
  }

  function render(time?: number) {
    if (time === undefined) {
      clrScr()
      return
    }

    const m = Math.floor(time / 60)
    const s = time - m * 60
    const minutes = `0${ m }`.slice(m < 100 ? -2 : -3)
    const seconds = `0${ s }`.slice(-2)

    clrScr(true, s % 2 === 0)

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
    draw(10, 0) // hyphen
    draw(11, 1) // empty digit
    draw(11, 2)
    draw(11, 3)
    draw(11, 4)
  }

  return {
    render,
    empty,
  }
}
