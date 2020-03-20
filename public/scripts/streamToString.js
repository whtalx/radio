export function streamToString(stream) {
  return new Promise((resolve) => {
    let result = ``
    stream.on(`data`, chunk => {
      result += chunk.toString()
      result.length > 3000 && resolve(result)
    })

    stream.on(`end`, () => resolve(result))
  })
}
