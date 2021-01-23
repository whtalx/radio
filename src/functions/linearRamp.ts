export function linearRamp(callback: Function, duration = 500) {
  function ramp() {
    let progress = 0
    let start = NaN
    requestAnimationFrame(step)

    function step(timeStamp: number) {
      if (!start) start = timeStamp

      progress = (timeStamp - start) / duration

      if (progress > 1) {
        callback(1)
      } else {
        callback(progress)
        requestAnimationFrame(step)
      }
    }
  }

  return callback instanceof Function
    ? ramp()
    : linearRamp
}
