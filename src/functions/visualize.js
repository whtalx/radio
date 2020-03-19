export function visualize({ canvas, bands, peaks }) {
  const context = canvas.getContext(`2d`)
  const { width, height } = canvas
  const wx = width / 79
  const hx = height / 19

  const clear = () => {
    context.clearRect(0,0, width, height);
    // context.fillStyle = `hsl(0, 0%, 0%)`
    // context.fillRect(0, 0, width, height);
    //
    // [...Array(19).keys()].forEach((y) => {
    //   [...Array(79).keys()].forEach((x) => {
    //     if (x % 2 === 0 && y % 2 === 0) {
    //       context.fillStyle = x === 0
    //         ? y % 4 === 0
    //           ? `hsl(216, 60%, 81%)`
    //           : `hsl(205, 100%, 71%)`
    //         : y === 18
    //           ? x % 4 === 0
    //             ? `hsl(216, 60%, 81%)`
    //             : `hsl(205, 100%, 71%)`
    //           : `hsl(240, 41%, 16%)`
    //
    //       context.fillRect(x * wx, y * hx, wx, hx)
    //     }
    //   })
    // })
  }

  clear()

  const gradient = context.createLinearGradient(0, 0, 0, 16 * hx)

  gradient.addColorStop(0, `hsl(0, 100%, 50%)`)
  gradient.addColorStop(.25, `hsl(30, 100%, 50%)`)
  gradient.addColorStop(.5, `hsl(60, 100%, 50%)`)
  gradient.addColorStop(.75, `hsl(90, 100%, 50%)`)
  gradient.addColorStop(1, `hsl(120, 100%, 50%)`)

  for (let i = 0; i < bands.length; i++) {
    const band = Math.floor(16 / 255 * bands[i])
    const peak = Math.max(Math.floor(16 / 255 * peaks[i]), band)
    const x = i === 0
      ? 2 * wx
      : (((i - 1) * 4) + 6) * wx

    context.fillStyle = gradient
    context.fillRect(x, height - band * hx, 3 * wx, band * hx - 3)

    context.fillStyle = `hsl(0, 0%, 90%)`
    context.fillRect(x, height - 5 - peak * hx, 3 * wx, hx)
  }
}
