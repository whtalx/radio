export default (list) =>
  list.map((language) => ({
    ...language,
    search: { language: language.name },
  }))
