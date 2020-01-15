export default (src) =>
  /(file|localhost):/.test(src)
    ? /blob:/.test(src)
      ? `loading`
      : `paused`
    : `loading`
