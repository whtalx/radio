export default (src) =>
  /blob:|http:\/\/\[::1]:8520/.test(src)
    ? `loading`
    : `paused`
