export interface SpectrumInterface {
  render: (x: number[]) => void;
  empty: () => void;
}

export default function Spectrum(canvas: HTMLCanvasElement): SpectrumInterface {
  const context = canvas.getContext(`2d`)!
  const { width, height } = canvas

  function wx(value: number) {
    return value * devicePixelRatio
  }

  function hy(value: number) {
    return value * devicePixelRatio
  }

  function clrScr() {
    context.clearRect(0, 0, width, height)
  }

  function drawTick(x: number, y: number, opacity: number = 1) {
    context.fillStyle = `rgba(245, 250, 255, ${ opacity })`
    context.fillRect(x, y, wx(3), hy(1))
  }

  function drawBand(value: number, index: number) {
    const x = wx(index) + wx(3) * index
    const ticks = Math.floor(value * 10)

    drawTick(x, height - hy(ticks + 1) * 2 - hy(2)) // TODO: replace with peak

    for (let tick = 0; tick <= ticks; tick++) {
      const y = height - hy(tick) * 2 - hy(1)
      drawTick(x, y, 1 - tick / 10)
    }
  }

  function render(bands: number[]) {
    clrScr()
    bands.forEach(drawBand)
  }

  function empty() {
    clrScr()
  }

  return {
    render,
    empty,
  }
}
