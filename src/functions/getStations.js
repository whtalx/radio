export default (list) =>
  list.reduce(
    (stations, station) => {
      const { url, url_resolved, changeuuid, name } = station
      const src = (url_resolved || url).replace(/^(%20)/, ``)
      return stations.findIndex(i => i.src === src) !== -1
        ? stations
        : [...stations, { id: changeuuid, name, src }]
    },
    []
  )
