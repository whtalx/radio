// import truncURI from './truncURI'

export default (endpoint) =>
  fetch(endpoint)
    .then(response => response.json())
    .then((data) =>
      Array.isArray(data)
        ? data.reduce(
            (stations, station) => {
              const { id, stationuuid, name, url, url_resolved } = station
              if (!url_resolved && /.m3u|.m3u8|.pls|.asx|.ashx/.test(url)) {
                console.log(name)
                // return stations
              }

              let src = url_resolved || url // truncURI(url_resolved || url)
              if (/^(%20)/.test(src)) {
                src = src.replace(/^(%20)/, ``)
              }

              return stations
                .filter(station => station.src === src)
                .length !== 0
                  ? stations
                  : [
                    ...stations,
                    {
                      id,
                      stationuuid,
                      name,
                      src,
                    },
                  ]
            },
        [])
        : null
    )
