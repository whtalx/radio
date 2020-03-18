export function getLanguages(list) {
  return list.map((language) => ({
    ...language,
    search: { language: language.name },
  }))
}
