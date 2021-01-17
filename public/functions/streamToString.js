export function streamToString(stream) {
  function callback(resolve) {
    let result = ``

    stream.on(`data`, chunk => {
      result += chunk.toString()
      result.length > 3000 && resolve(result)
    })

    stream.on(`end`, () => resolve(result))
  }

  return new Promise(callback)
}
