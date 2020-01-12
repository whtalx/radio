export default (list) =>
  list.map((code) => ({
    ...code,
    search: { countrycode: code.name },
  }))
