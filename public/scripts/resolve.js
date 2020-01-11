import streamToString from './streamToString'

export default ({ url, data, send, recurse }) => async (response) => {
  response.on(`error`, (e) => {
    console.log(`stream destroyed:\n `, e)
    const { groups } = /recursive call:\s(?<link>[\S]+)/.exec(e) || {}
    groups && recurse(groups.link)
  })

  const { headers, statusCode, statusMessage } = response

  if (statusCode !== 200) {
    send(`rejected`, data)
    response.destroy(`Response status ${ statusCode }: ${ statusMessage }`)
    return
  }

  const [type, subtype] = (headers[`content-type`] || `undefined/undefined`).split(`/`)

  const shut = (link) => {
    response.destroy(`resolved ${ link }\n  with content-type: ${ type }/${ subtype }`)
  }

  const resolve = ({ url, hls }) => {
    send(
      `resolved`,
      {
        ...data,
        hls,
        src_resolved: hls ? true : url,
        title: headers[`icy-name`] || headers[`ice-name`]
      }
    )
    shut(url || hls)
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
      if (text.substr(0, 7) === `#EXTM3U`) {
        resolve({ hls: url })
        return
      }

      console.log(`parsing\n${ text }`)

      const links = text.match(/http(s)?:\/\/[\w\d.-:/=%&?#]+(?=\s)?/ig)
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
