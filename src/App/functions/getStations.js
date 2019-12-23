export default (list) =>
  list.reduce(
    (stations, station) => {
      const { url, url_resolved } = station
      const src = (url_resolved || url).replace(/^(%20)/, ``)
      return stations.findIndex(i => i.src === src) !== -1
        ? stations
        : [...stations, { ...station, src }]
    },
    []
  )
