export function makePlayerState(src) {
  return /blob:|http:\/\/\[::1]:8520/.test(src)
    ? `loading`
    : `paused`
}
