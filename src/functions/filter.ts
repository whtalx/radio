interface Props {
  blur: number
  brightness: number
  contrast: number
  hue: number
  invert: number
  opacity: number
  saturation: number
  sepia: number
  [key: string]: string | number
}

function cssFilter({ blur, brightness, contrast, hue, invert, opacity, saturation, sepia }: Props) {
  const filter = []

  isFinite(brightness) && filter.push(`brightness(${ brightness })`)
  isFinite(contrast) && filter.push(`contrast(${ contrast })`)
  isFinite(opacity) && filter.push(`opacity(${ opacity })`)
  isFinite(hue) && filter.push(`hue-rotate(${ hue }deg)`)
  isFinite(invert) && filter.push(`invert(${ invert })`)
  isFinite(sepia) && filter.push(`sepia(${ sepia })`)
  isFinite(blur) && filter.push(`blur(${ blur }px)`)
  isFinite(saturation) && filter.push(
    saturation < 0
      ? `grayscale(${ -saturation / 20 })`
      : `saturate(${ saturation + 1 })`
  )

  return filter.join(' ')
}

export function filter(color: string) {
  return function ({ theme }: { [key: string]: any }) {
    return color && theme[color] && `filter: ${ cssFilter(theme[color]) };`
  }
}
