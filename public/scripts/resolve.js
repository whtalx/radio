import { serve, request, streamToString } from '.'

/* TODO: handle `ECONNREFUSED` */

export function resolve({ url, data }) {
  return async (response) => {
    // response.socket.on(`error`, (e) => {
    //   global.request = null
    //   const { groups } = /recursive call:\s(?<link>[\w\d.\-:;/=%&?#@]+)/.exec(e) || {}
    //   groups && request(undefined, data, groups.link)
    // })

    const { headers, statusCode, statusMessage } = response

    if (statusCode !== 200) {
      if (statusCode > 300 && statusCode < 304) {
        console.log(`recursive call: ${ response.headers.location }`)
        request(undefined, data, response.headers.location)
        response.destroy()
        return
      }

      global.player.webContents.send(`rejected`, data)
      console.log(`Response status ${ statusCode }: ${ statusMessage }`)
      response.destroy()
      return
    }

    const [type, subtype] = (headers[`content-type`] || `undefined/undefined`).split(`/`)

    const shut = (link) => {
      console.log(`resolved ${ link }\n  with content-type: ${ type }/${ subtype }`)
      response.destroy()
    }

    const resolve = ({ url, hls }) => {
      console.log(`resolved with content-type: ${ type }/${ subtype }`)

      if (url) {
        global.player.webContents.send(`resolved`, { ...data, src_resolved: url })
        serve(response)
      } else if (hls) {
        global.stream && (global.stream = null)
        global.player.webContents.send(`resolved`, { ...data, hls, src_resolved: true })
        shut(hls)
      }
    }

    switch (type) {
      case `audio`:
      case `video`:
      case `undefined`: {
        resolve({ url })
        return
      }

      case `application`: {
        if (subtype === `ogg`) {
          resolve({ url })
          return
        }

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
          : url.match(/\S+\//) + links[links.length - 1]

        console.log(`recursive call: ${ lastLink }`)
        request(undefined, data, lastLink)
        response.destroy()
        return
      }

      case `text`: {
        if (/http(s)?:\/\/[\w\d_.-]+(:\d+)?\/;/.test(url)) {
          global.player.webContents.send(`rejected`, data)
          shut(response.url)
        } else {
          const link = url.match(/http(s)?:\/\/[\w\d_.-]+(:\d+)?/g)[0]
          console.log(`recursive call: ${ link }/;`)
          request(undefined, data, link)
          response.destroy()
        }
        return
      }

      default: {
        global.player.webContents.send(`rejected`, data)
        shut(response.url)
        return
      }
    }
  }
}
