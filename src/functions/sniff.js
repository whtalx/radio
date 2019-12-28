import error from './error'

const sniff = ({ recursive = ``, station, signal }) => {
  const { src } = station
  const unresolvable = { ...station, unresolvable: true }

  if (!src) {
    console.log(`this should never happen. if you read this, god bless you`)
    error({ message: `station src is ${ src }` })
    return unresolvable
  }

  const url = (recursive || src)

  console.log(recursive ? `recursive sniff out: `: `sniff out: `, url)

  return fetch(url, { signal })
    .then((response) => {
      const [type, subtype] = (response.headers.get(`content-type`) || `/`).split(`/`)
      console.log(`responded with status ${ response.status } and content-type: ${ type || `?` }/${ subtype || `?` }`)

      if (response.status === 404 || response.status === 403) {
        return unresolvable
      } else if (!type || /aac|ogg|mp4|mpeg$|opus/.test(subtype)) {
        console.log(`resolved: `, url)
        return { ...station, src_resolved: url }
      } else if (type === `application` && /vnd\.apple\.mpegurl|x-mpegurl|octet-stream/i.test(subtype)) {
          return { ...station, src_resolved: true, hls: url }
      } else if (type === `text` && /html/.test(subtype)) {
        return /http(s)?:\/\/[\w.-]+(:\d+)?\/;/.test(url)
          ? response.text()
          : sniff({
            recursive: `${ url.match(/http(s)?:\/\/[\w\d.-]+(:\d+)?/g)[0] }/;`,
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

      console.log(result)
      // const isM3U = result.substr(0,7) === `#EXTM3U`

      // if (isM3U) {
      //   const links = result
      //     .replace(/#.+\n/g, ``)
      //     .split(`\n`)
      //     .filter(i => i)
      //     .map(i => /^http/.test(i) ? i : src.match(/\S+\//g) + i)
      //   const lastLink = /^http/.test(links[links.length - 1])
      //     ? links[links.length - 1]
      //     : src.match(/\S+\//g) + links[links.length - 1]
      //
      //   return  sniff({ recursive: links, station, signal, })
      // }

      return unresolvable
    })
    .catch((e) => {
      error(e)
      return unresolvable
    })
}

export default sniff
