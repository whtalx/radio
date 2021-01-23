export function makePlayerState(src) {
  return /blob:|http:\/\/\[::1]/.test(src)
    ? `loading`
    : `paused`
}
