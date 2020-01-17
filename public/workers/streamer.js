let isWaiting = false
let controller = null
let buffers = []
const opt = {
  mode: `cors`,
  referrer: ``,
  credentials: `omit`,
  // headers: new Headers({ 'Icy-MetaData': `1` }),
}

const error = (e) =>
  postMessage({ type: `error`, payload: e })

const sendChunk = (arrayBuffer) =>
  postMessage({ type: `buffer`, payload: arrayBuffer }, [arrayBuffer])

onmessage = ({ data: { type, payload } }) => {
  switch (type) {
    case `start`: {
      if (controller) controller.abort()
      controller = new AbortController()
      const { signal } = controller
      signal.onabort = () => {
        controller = null
      }

      fetch(payload, { ...opt, signal })
        .then(response => {
          let mime = response.headers.get(`content-type`) || `audio/mpeg`
          mime === `audio/aacp` && (mime = `audio/aac`)
          mime === `application/ogg` && (mime = `audio/ogg`)
          postMessage({ type: `mime`, payload: mime })

          const reader = response.body.getReader()
          const recurse = ({ value }) => {
            if (!controller || signal.aborted) return

            if (isWaiting) {
              isWaiting = false
              sendChunk(value.buffer)
            } else {
              buffers.push(value.buffer)
            }

            return reader.read().then(recurse).catch(error)
          }
          reader.read().then(recurse).catch(error)
        })
        .catch(error)

      return
    }

    case `stop`: {
      controller && controller.abort()
      buffers = []
      return
    }

    case `ready`: {
      buffers.length
        ? sendChunk(buffers.shift())
        : isWaiting = true
      return
    }

    default:
      return
  }
}
