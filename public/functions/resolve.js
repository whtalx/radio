import { serve, request, streamToString } from '.'

export function resolve({ url, data }) {
  return async (response) => {
    response.socket.on(`error`, () => {
      global.prefetch = null
    })

    const { headers, statusCode, statusMessage } = response

    if (statusCode > 208) {
      console.log(`Response status ${ statusCode }: ${ statusMessage }`)

      statusCode > 300 && statusCode < 304
        ? redirect()
        : global.player.webContents.send(`rejected`, data)

      response.destroy()
      return
    }

    const [type, subtype] = (headers[`content-type`] || `undefined/undefined`).split(`/`)

    if (/mpegurl/i.test(subtype)) {
      return parse()
    }

    switch (type) {
      case `audio`:
      case `video`:
      case `undefined`: {
        return resolve({ url })
      }

      case `application`: {
        if (subtype === `ogg`) {
          resolve({ url })
          return
        }

        return await parse()
      }

      case `text`: {
        if (/http(s)?:\/\/[\w\d_.-]+(:\d+)?\/;/i.test(url)) {
          global.player.webContents.send(`rejected`, data)
          response.destroy()
        } else {
          const link = url.match(/http(s)?:\/\/[\w\d_.-]+(:\d+)?/ig)[0]
          console.log(`recursive call:\n\t${ link }/;`)
          request(undefined, data, link)
          response.destroy()
        }
        return
      }

      default: {
        global.player.webContents.send(`rejected`, data)
        response.destroy()
        return
      }
    }

    function resolve({ url, hls }) {
      console.log(`resolved\n\t${ hls || url }\nwith content-type:\n\t${ type }/${ subtype }`)

      if (url) {
        global.player.webContents.send(`resolved`, { ...data, src_resolved: url })
        global.request = global.prefetch
        global.prefetch = null
        serve(response)
      } else if (hls) {
        global.stream && (global.stream = null)
        global.player.webContents.send(`resolved`, { ...data, hls, src_resolved: true })
        response.destroy()
      }
    }

    function redirect() {
      const location = /^http/i.test(response.headers.location)
        ? response.headers.location
        : /^\//.test(response.headers.location)
          ? url.match(/\w+:\/\/[^/]+/)[0] + response.headers.location
          : url.match(/\S+\//)[0] + response.headers.location

      console.log(`recursive call: ${ location }`)
      request(undefined, data, location)
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
        global.player.webContents.send(`rejected`, data)
        console.log(`can't parse`)
        response.destroy()
        return
      }

      // links = text.match(/http(s)?:\/\/[\w\d.\-:/=%&?#@]+(?=\s)?/ig).split(`\n`).filter(i => i)

      const lastLink = /^http/.test(links[links.length - 1])
        ? links[links.length - 1]
        : /^\//.test(links[links.length - 1])
          ? url.match(/\w+:\/\/[^/]+/)[0] + links[links.length - 1]
          : url.match(/\S+\//)[0] + links[links.length - 1]

      console.log(`recursive call: ${ lastLink }`)
      request(undefined, data, lastLink)
      response.destroy()
    }
  }
}
