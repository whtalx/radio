import countries from './iso3166-1-alpha-2'

export default (list) =>
  list
    .map(({ name, stationcount }) => ({
      ...countries(name),
      search: { countrycode: name },
      stationcount,
    }))
    .sort((a, b) =>
      a.name === b.name
        ? 0
        : a.name < b.name
          ? -1
          : 1
    )
