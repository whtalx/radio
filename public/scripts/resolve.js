import serve from './serve'
import request from './request'
import streamToString from './streamToString'

export default ({ url, data }) => async (response) => {
  response.socket.on(`error`, (e) => {
    console.log(`stream destroyed:\n `, e)
    global.request = null
    const { groups } = /recursive call:\s(?<link>[\w\d.\-:;/=%&?#@]+)/.exec(e) || {}
    groups && request(undefined, data, groups.link)
  })

  const { headers, statusCode, statusMessage } = response

  if (statusCode !== 200) {
    if (statusCode > 300 && statusCode < 304) {
      response.destroy(`recursive call: ${ response.headers.location }`)
      return
    }

    global.player.webContents.send(`rejected`, data)
    response.destroy(`Response status ${ statusCode }: ${ statusMessage }`)
    return
  }

  const [type, subtype] = (headers[`content-type`] || `undefined/undefined`).split(`/`)

  const shut = (link) => {
    response.destroy(`resolved ${ link }\n  with content-type: ${ type }/${ subtype }`)
  }

  const resolve = ({ url, hls }) => {
    if (url) {
      serve(response)
      global.player.webContents.send(
        `resolved`,
        {
          ...data,
          src_resolved: url,
        }
      )
    } else if (hls) {
      global.player.webContents.send(
        `resolved`,
        {
          ...data,
          hls,
          src_resolved: true,
        }
      )
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

      const links = text.match(/http(s)?:\/\/[\w\d.\-:/=%&?#@]+(?=\s)?/ig)
      // .replace(/#.+\n/g, ``)
      // .split(`\n`)
      // .filter(i => i)
      // .map(i => /^http/.test(i) ? i : src.match(/\S+\//g) + i)

      if (!links) return

      const lastLink = /^http/.test(links[links.length - 1])
        ? links[links.length - 1]
        : url.match(/\S+\//) + links[links.length - 1]

      response.destroy(`recursive call: ${ lastLink }`)
      return
    }

    case `text`: {
      /http(s)?:\/\/[\w\d_.-]+(:\d+)?\/;/.test(url)
        ? shut(response.url)
        : response.destroy(`recursive call: ${ url.match(/http(s)?:\/\/[\w\d_.-]+(:\d+)?/g)[0] }/;`)
      return
    }

    default: {
      shut(response.url)
      return
    }
  }
}
