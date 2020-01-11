export default (stream) =>
  new Promise((resolve, reject) => {
    let result = ``
    stream.on(`error`, reject)
    stream.on(`data`, chunk => {
      result += chunk.toString()
    })

    stream.on(`end`, () => resolve(result))
  })
