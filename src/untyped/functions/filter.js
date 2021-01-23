function cssFilter({ blur, brightness, contrast, hue, invert, opacity, saturation, sepia }) {
  const filter = []

  isFinite(brightness) && filter.push(`brightness(${ brightness })`)
  isFinite(contrast) && filter.push(`contrast(${ contrast })`)
  isFinite(opacity) && filter.push(`opacity(${ opacity })`)
  isFinite(hue) && filter.push(`hue-rotate(${ hue }deg)`)
  isFinite(invert) && filter.push(`invert(${ invert })`)
  isFinite(sepia) && filter.push(`sepia(${ sepia })`)
  isFinite(blur) && filter.push(`blur(${ blur }px)`)
  isFinite(saturation) && (
    saturation < 0
      ? filter.push(`grayscale(${ -saturation / 20 })`)
      : filter.push(`saturate(${ saturation + 1 })`)
  )

  return filter.join(' ')
}

export function filter(color) {
  return function ({ theme }) {
    return color && theme[color] && `filter: ${ cssFilter(theme[color]) };`
  }
}
