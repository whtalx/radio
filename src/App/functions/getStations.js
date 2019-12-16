import truncURI from './truncURI'

export default (enpoint, callback) =>
  fetch(enpoint)
    .then(response => response.json())
    .then((data) =>
      data.reduce((stations, { stationuuid, name, url_resolved, codec }) => {
        if (codec === `UNKNOWN`) return stations
        const src = truncURI(url_resolved)
        return stations
          .filter(station => station.src === src)
          .length !== 0
            ? stations
            : [
              ...stations,
              {
                uuid: stationuuid,
                name,
                src,
              },
            ]
      },
      [])
    )
    .then(callback)
    .catch(({ message }) => console.error(message))
