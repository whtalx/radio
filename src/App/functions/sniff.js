import error from './error'

const sniff = ({ url, signal, recursive = false }) => {
  if (!url) {
    console.log(`this should never happen. if you read this, god bless you`)
    return {
      station: url,
    }
  }

  if (recursive) {
    console.log(`recursive call: `, url)
  } else {
    console.log(`new call: `, url)
  }

  return fetch(url, { signal })
    .then((response) => {
      const [type, subtype] = (response.headers.get(`content-type`) || ``).split(`/`)
      console.log(`content-type: ${ type }/${ subtype }`)

      if (!type || /aac|ogg|mp4|mpeg$|opus/.test(subtype)) {
        return {
          station: url,
        }
      } else if(type === `text` && /html/.test(subtype)) {
        if (!/http(s)*:\/\/[\w.-]+:\d+\/;/.test(url)) {
          return sniff({
            url: `${ url.match(/http(s)*:\/\/[\w\d.-]+:\d+/g)[0] }/;`,
            recursive: true,
            signal,
          })
        }

        return response.text()
          // .then(text => console.log(`response text: `, text))
          // .then(() => ({}))
          // .catch(e => console.log(`can't resolve ${ response.url } response text: `, e))

      } else if (type === `video`) {
        return {}
      }

      return response.text()
    })
    .then(result => {
      if (typeof result !== `string`) return result

      console.log(`parsing: `, result)
      const isM3U = result.substr(0,7) === `#EXTM3U`
      /*
       * works with:
       * application/vnd.apple.mpegurl
       * application/x-mpegURL
       */

      if (isM3U) {
        const links = result.replace(/#.+\n/g, ``).split(`\n`).filter(i => i)

        return sniff({
          url: /^http/.test(links[links.length - 1])
            ? links[links.length - 1]
            : url.replace(/[\d\w-]+\.[\d\w-]+$/g, links[links.length - 1]),
          recursive: true,
          signal,
        })
      }

      return {}
    })
    .catch(error)
}

export default sniff
