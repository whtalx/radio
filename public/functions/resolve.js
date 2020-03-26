import { serve, request, streamToString, abort } from '.'

export function resolve({ url, data }) {
  return async (response) => {
    response.socket.on(`error`, () => abort())

    const { headers, statusCode, statusMessage } = response

    if (statusCode > 208) {
      console.log(`Response status ${ statusCode }: ${ statusMessage }`)
      return statusCode > 300 && statusCode < 304
        ? redirect()
        : reject()
    }

    const [type, subtype] = (headers[`content-type`] || `undefined/undefined`).split(`/`)

    if (/mpegurl/i.test(subtype)) return parse()

    switch (type) {
      case `audio`:
      case `video`:
      case `undefined`:
        return resolve({ url })

      case `application`:
        return subtype === `ogg`
          ? resolve({ url })
          : await parse()

      case `text`:
        return /http(s)?:\/\/[\w\d_.-]+(:\d+)?\/;/i.test(url)
          ? reject(data)
          : recursive(url.match(/http(s)?:\/\/[\w\d_.-]+(:\d+)?/ig)[0])

      default:
        return reject(data)
    }

    function resolve({ url, hls }) {
      console.log(`resolved\n\t${ hls || url }\nwith content-type:\n\t${ type }/${ subtype }`)

      if (url) {
        let { bitrate, samplerate, channels } = getAudioInfo(headers[`ice-audio-info`])

        !bitrate && (bitrate = parseInt(/\d+/.exec(headers[`icy-br`])))
        !samplerate && (samplerate = parseInt(/\d+/.exec(headers[`icy-sr`])))

        global.player.webContents.send(`resolved`, { ...data, unresolvable: undefined, src_resolved: url, bitrate, samplerate, channels })
        global.request = global.prefetch
        global.prefetch = null
        return serve(response)
      } else if (hls) {
        global.stream && (global.stream = null)
        global.player.webContents.send(`resolved`, { ...data, unresolvable: undefined, hls, src_resolved: true })
        return response.destroy()
      }
    }

    function redirect() {
      const location = /^http/i.test(response.headers.location)
        ? response.headers.location
        : /^\//.test(response.headers.location)
          ? url.match(/\w+:\/\/[^/]+/)[0] + response.headers.location
          : url.match(/\S+\//)[0] + response.headers.location

      return recursive(location)
    }

    async function parse() {
      const text = await streamToString(response)

      if (/EXT-X-TARGETDURATION/.test(text)) {
        resolve({ hls: url })
        return
      }

      console.log(`parsing\n${ text }`)

      let links

      if(/#EXTM3U/.test(text)) { // *.m3u
        links = text
          .split(`\n`)
          .filter(i => i[0] !== `#`)
          .filter(i => i)
      } else if(/\[playlist]/.test(text)) { // *.pls
        links = text
          .split(`\n`)
          .filter(i => /^File/g.test(i))
          .map(i => i.replace(/File\d=/g, ``))
      } else {
        console.log(`can't parse`)
        return reject()
      }

      // links = text.match(/http(s)?:\/\/[\w\d.\-:/=%&?#@]+(?=\s)?/ig).split(`\n`).filter(i => i)

      const lastLink = /^http/.test(links[links.length - 1])
        ? links[links.length - 1]
        : /^\//.test(links[links.length - 1])
          ? url.match(/\w+:\/\/[^/]+/)[0] + links[links.length - 1]
          : url.match(/\S+\//)[0] + links[links.length - 1]

      return recursive(lastLink)
    }

    function getAudioInfo(string = ``) {
      return string.split(`;`).reduce(
        (a, i) => {
          const [key, value] = i.split(`=`)
          a[key.replace(/ice-/g, ``)] = parseInt(value)
          return a
        },
        {}
      )
    }

    function reject() {
      global.player.webContents.send(`resolved`, { ...data, unresolvable: true })
      return response.destroy()
    }

    function recursive(url) {
      console.log(`recursive call: ${ url }`)
      url && request(undefined, data, url)
      return response.destroy()
    }
  }
}
