import error from './error'

const sniff = ({ url, signal, recursive = false }) => {
  if (!url) {
    console.log(`this should never happen. if you read this, god bless you`)
    error({ message: `url is ${ url }` })
    return {}
  }

  if (recursive) {
    console.log(`recursive sniff out: `, url)
  } else {
    console.log(`sniff out: `, url)
  }

  return fetch(url, { signal })
    .then((response) => {
      const [type, subtype] = (response.headers.get(`content-type`) || ``).split(`/`)
      console.log(`content-type: ${ type }/${ subtype }`)

      if (!type || /aac|ogg|mp4|mpeg$|opus/.test(subtype)) {
        return { src_resolved: url }
      } else if (type === `text` && /html/.test(subtype)) {
        if (!/http(s)?:\/\/[\w.-]+(:\d+)?\/;/.test(url)) {
          return sniff({
            url: `${ url.match(/http(s)?:\/\/[\w\d.-]+(:\d+)?/g)[0] }/;`,
            recursive: true,
            signal,
          })
        }

        return response.text()
      } else if (type === `video`) {
        return {}
      }

      return response.text()
    })
    .then(result => {
      if (typeof result !== `string`) return result

      console.log(`parsing:\n`, result)
      const isM3U = result.substr(0,7) === `#EXTM3U`
      /*
       * works with:
       * application/vnd.apple.mpegurl
       * application/x-mpegURL
       *
       * TODO: implement support of 11 sec files
       */

      if (isM3U) {
        const links = result.replace(/#.+\n/g, ``).split(`\n`).filter(i => i)
        const lastLink = /^http/.test(links[links.length - 1])
          ? links[links.length - 1]
          : url.match(/\S+\//g) + links[links.length - 1]

        return sniff({
          url: lastLink,
          recursive: true,
          signal,
        })
      }

      return {}
    })
    .catch(e => {
      error(e)
      return {}
    })
}

export default sniff
