import URL from 'url'
import http from 'http'
import https from 'https'

import {
  void0,
  StreamReader,
  getAudioInfo,
  getOggBitrate,
  streamToString,
} from '.'

export function Request(self) {
  const state = {}

  function abort(destroy = false) {
    console.log(`aborting previous request${ destroy ? `, destroying stream` : `` }`)

    state.request && state.request.abort()
    delete state.request

    if (destroy) {
      self.stream && self.stream.destroy()
      delete self.stream
      delete self.request
    }
  }

  function make(data, redirect) {
    state.request && abort()

    const { src_resolved, src, hls } = data
    if (redirect) {
      console.log(`redirect:\n\t${ redirect }`)
      get({ url: redirect, callback: handleResponse({ url: redirect, data }) })
    } else if (src_resolved) {
      const url = hls || src_resolved
      console.log(`fetching resolved:\n\t${ url }`)
      get({ url, callback: handleResponse({ url, data }) })
    } else if (src) {
      console.log(`fetching:\n\t${ src }`)
      get({ url: src, callback: handleResponse({ url: src, data }) })
    } else {
      console.log(`this should never happen. if you read this, god bless you\npassed data:\n`, data)
    }
  }

  function get({ url, callback }) {
    if (!url || !callback) return

    const options = URL.parse(url)
    options.followAllRedirects = false
    options.headers = {
      'User-Agent': `WinampMPEG/2.6`,
      'Accept': `*/*`,
      'Icy-MetaData': `1`,
    }

    state.request = options.protocol === `https:`
      ? https.request(options)
      : http.request(options)

    state.request.on(`error`, ({ message }) => {
      callback({
        statusCode: Infinity,
        statusMessage: message,
        socket: { on: void0 },
        destroy: void0,
      })
    })
    state.request.on(`socket`, onSocket)
    state.request.on(`response`, callback)
    state.request.end()
  }

  function onSocket(socket) {
    let listeners

    function substitute(chunk) {
      return /icy/i.test(chunk.slice(0, 3))
        ? Buffer.from(chunk.toString().replace(/icy/i, `HTTP/1.0`))
        : chunk
    }

    function onData(chunk) {
      socket.removeListener(`data`, onData)

      listeners.forEach((listener) => socket.on(`data`, listener))
      listeners = null
      socket.emit(`data`, substitute(chunk))
    }

    listeners = socket.listeners(`data`)
    socket.removeAllListeners(`data`)
    socket.on(`data`, onData)
  }

  function handleResponse({ url, data }) {
    return async function handler(response) {
      response.socket.on(`error`, (error) => {
        console.error(error)
        abort()
      })

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
          return resolve({ url, data })

        case `application`:
          return subtype === `ogg`
            ? resolve({ url, data })
            : await parse()

        case `text`:
          return /http(s)?:\/\/[\w\d_.-]+(:\d+)?\/;/i.test(url)
            ? reject(data)
            : recursive(url.match(/http(s)?:\/\/[\w\d_.-]+(:\d+)?/ig)[0])

        default:
          return reject(data)
      }

      function resolve(station) {
        console.log(`resolved\n\t${ station.hls || station.url }\nwith content-type:\n\t${ type }/${ subtype }`)

        if (station.url) {
          let { bitrate, samplerate, channels, quality } = getAudioInfo(headers[`ice-audio-info`])
          !samplerate && (samplerate = parseInt(/\d+/.exec(headers[`icy-sr`])))

          if (!bitrate) {
            const b = parseInt(/\d+/.exec(headers[`icy-br`]))
            if (!b && subtype === `ogg` && quality) {
              getOggBitrate(quality)
            } else {
              bitrate = b
            }
          }

          self.sendMessage(`resolved`, { ...data, unresolvable: undefined, src_resolved: station.url, bitrate, samplerate, channels })
          self.request = state.prefetch
          delete state.prefetch
          return serve(response)
        } else if (station.hls) {
          self.stream && delete self.stream
          self.sendMessage(`resolved`, { ...data, unresolvable: undefined, hls: station.hls, src_resolved: true })
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

        if (/#EXTM3U/.test(text)) { // *.m3u
          links = text
            .split(`\n`)
            .filter(i => i[0] !== `#`)
            .filter(i => i)
        } else if (/\[playlist]/.test(text)) { // *.pls
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

      function reject() {
        self.sendMessage(`resolved`, { ...data, unresolvable: true })
        return response.destroy()
      }

      function recursive(url) {
        console.log(`recursive call: ${ url }`)
        url && make(data, url)
        return response.destroy()
      }
    }
  }

  function serve(stream) {
    self.stream && self.stream.destroy()
    delete self.stream

    if (!stream.pipe) return

    if (stream.headers[`icy-metaint`]) {
      console.log(`serving radio stream with meta tags`)
      self.stream = new StreamReader(stream.headers[`icy-metaint`])

      self.stream.on(`metadata`, (metadata) => {
        self.sendMessage(`metadata`, metadata)
      })

      stream.pipe(self.stream)
    } else {
      console.log(`serving radio stream without meta tags`)
      self.stream = stream
    }

    self.sendMessage(`served`, self.server.address().port)
  }

  return {
    make,
    abort,
  }
}
