export function getAudioInfo(string = ``) {
  return string.split(`;`).reduce(
    (a, i) => {
      const [key, value] = i.split(`=`)
      a[key.replace(/ice-/g, ``)] = /quality/.test(key) ? value : parseInt(value)
      return a
    },
    {}
  )
}
