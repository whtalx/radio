export default ({ countrycode, language, tag }) => {
  const search = {
    hidebroken: true,
  }

  if (countrycode) {
    search.countrycode = countrycode
  }

  if (language) {
    search.language = language
    search.languageExact = true
  }

  if (tag) {
    search.tag = tag
    search.tagExact = true
  }

  return {
    type: `SET_ALL`,
    payload: {
      type: `stations`,
      search,
    }
  }
}
