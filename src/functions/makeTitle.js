import countries from './iso3166-1-alpha-2'

export default (props = {}) => {
  const { countrycode, language, tag } = props
  if (tag) return tag
  if (language) return language
  if (countrycode) return countries(countrycode).name
}
