import error from './error'

const sniff = ({ recursive = ``, station, signal }) => {
  const { src } = station
  const unresolvable = { ...station, unresolvable: true }

  if (!src) {
    console.log(`this should never happen. if you read this, god bless you`)
    error({ message: `station src is ${ src }` })
    return unresolvable
  }

  recursive
    ? console.log(`recursive sniff out: `, recursive)
    : console.log(`sniff out: `, src)

  return fetch(recursive || src, { signal })
    .then((response) => {
      const [type, subtype] = (response.headers.get(`content-type`) || `/`).split(`/`)
      console.log(`content-type: ${ type }/${ subtype }`)

      if (!type || /aac|ogg|mp4|mpeg$|opus/.test(subtype)) {
        console.log(`resolved: `, recursive || src)
        return { ...station, src_resolved: recursive || src }
      } else if (type === `text` && /html/.test(subtype)) {
        return /\.m3u(8)?$|http(s)?:\/\/[\w.-]+(:\d+)?\/;/.test(src)
          ? response.text()
          : sniff({
            recursive: `${ src.match(/http(s)?:\/\/[\w\d.-]+(:\d+)?/g)[0] }/;`,
            station,
            signal,
          })
      } else if (type === `video`) {
        return unresolvable
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
          : src.match(/\S+\//g) + links[links.length - 1]

        return sniff({ recursive: lastLink, station, signal, })
      }

      return unresolvable
    })
    .catch((e) => {
      error(e)
      return unresolvable
    })
}

export default sniff
