// import truncURI from './truncURI'

export default (endpoint) =>
  fetch(endpoint)
    .then(response => response.json())
    .then((data) =>
      data.reduce((stations, station) => {
        const { id, stationuuid, name, url, url_resolved } = station
        if (!url_resolved && /.m3u|.m3u8|.pls|.asx|.ashx/.test(url)) {
          // console.log(station)
          return stations
        }

        const src = url_resolved || url // truncURI(url_resolved || url)
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
    )
