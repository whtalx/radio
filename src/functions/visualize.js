export function visualize({ canvas, bands, peaks }) {
  const context = canvas.getContext(`2d`)
  const { width, height } = canvas
  const wx = width / 79
  const hx = height / 19

  context.clearRect(0,0, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, 16 * hx)

  gradient.addColorStop(0, `hsl(11, 97%, 47%)`)
  gradient.addColorStop(.25, `hsl(29, 100%, 45%)`)
  gradient.addColorStop(.5, `hsl(43, 90%, 48%)`)
  gradient.addColorStop(.75, `hsl(71, 83%, 52%)`)
  gradient.addColorStop(.9, `hsl(112, 96%, 44%)`)
  gradient.addColorStop(1, `hsl(103, 100%, 32%)`)

  for (let i = 0; i < bands.length; i++) {
    const band = Math.floor(16 / 255 * bands[i])
    const peak = Math.max(Math.floor(16 / 255 * peaks[i]), band)
    const x = i === 0 ? 2 * wx : (((i - 1) * 4) + 6) * wx

    context.fillStyle = gradient
    context.fillRect(x, height - band * hx, 3 * wx, band * hx - 3)

    context.fillStyle = `hsl(0, 0%, 90%)`
    context.fillRect(x, height - 5 - peak * hx, 3 * wx, hx)
  }
}
