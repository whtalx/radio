export default function Spectrum(canvas) {
  const context = canvas.getContext(`2d`)
  const { width, height } = canvas

  function wx(value) {
    return value * devicePixelRatio
  }

  function hy(value) {
    return value * devicePixelRatio
  }

  function clrScr() {
    context.clearRect(0, 0, width, height)
  }

  function drawTick(x, y, opacity = 1) {
    context.fillStyle = `rgba(245, 250, 255, ${ opacity })`
    context.fillRect(x, y, wx(3), hy(1))
  }

  function drawBand(value, index) {
    const x = wx(index) + wx(3) * index
    const ticks = Math.floor(value * 10)

    drawTick(x, height - hy(ticks + 1) * 2 - hy(2)) // TODO: replace with peak

    for (let tick = 0; tick <= ticks; tick++) {
      const y = height - hy(tick) * 2 - hy(1)
      drawTick(x, y, 1 - tick / 10)
    }
  }

  function render(bands) {
    clrScr()
    bands.forEach(drawBand)
  }

  function stop() {
    clrScr()
  }

  return {
    render,
    stop,
  }
}
