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

  return fetch(url, { referrer: ``, signal })
    .then(async (response) => {
      const [type, subtype] = (response.headers.get(`content-type`) || `/`).split(`/`)

      if (response.status !== 200) {
        console.log(`responded with status ${ response.status }`)
        return unresolvable
      }

      switch (type) {
        case `audio`:
        case `video`:
        case ``: {
          console.log(`resolved ${ url } with content-type: ${ type || `undefined` }/${ subtype || `undefined` }`)
          return { ...station, src_resolved: url }
        }

        case `application`: {
          console.log(`resolved ${ url } with content-type: ${ type }/${ subtype }`)
          if (subtype === `ogg`) return { ...station, src_resolved: url }

          return await response.blob()
              .then(blob => blob.text())
              .then(
                (text) =>
                  text.substr(0,7) === `#EXTM3U`
                    ? { ...station, src_resolved: true, hls: url }
                    : text
              )
        }

        case `text`: {
          console.log(`responded ${ url } with content-type: ${ type }/${ subtype }`)

          return /http(s)?:\/\/[\w.-]+(:\d+)?\/;/.test(url)
            ? response.text()
            : sniff({
              recursive: `${ url.match(/http(s)?:\/\/[\w\d.-]+(:\d+)?/g)[0] }/;`,
              station,
              signal,
            })
        }

        default: {
          console.log(`responded ${ url } with content-type: ${ type }/${ subtype }`)
          return station
        }
      }
    })
    .then(result => {
      if (typeof result !== `string`) return result

      console.log(`parsing\n${ result }`)

      const links = result.match(/http(s)?:\/\/[\w\d.-:/=%&?#]+(?=\s)?/ig)
        // .replace(/#.+\n/g, ``)
        // .split(`\n`)
        // .filter(i => i)
        // .map(i => /^http/.test(i) ? i : src.match(/\S+\//g) + i)

      if (!links) return unresolvable

      const lastLink = /^http/.test(links[links.length - 1])
        ? links[links.length - 1]
        : url.match(/\S+\//g) + links[links.length - 1]

      return sniff({ recursive: lastLink, station, signal, })

    })
    .catch((e) => {
      error(e)
      console.log(e)
      return unresolvable
    })
}

export default sniff
