export function formatTime(time) {
  if (!Number.isFinite(time)) return `--:--`

  const minutes = Math.floor(time / 60)
  return [minutes > 9 ? minutes : `0${ minutes }`, `0${ time - minutes * 60 }`.slice(-2)].join(`:`)
}
