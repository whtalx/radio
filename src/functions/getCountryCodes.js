import { countries } from '.'

export function getCountryCodes(list) {
  return list
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
}
