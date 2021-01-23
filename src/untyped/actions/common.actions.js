import { createAction } from '@reduxjs/toolkit'

// set "search" store.api state
export const setApi = createAction(`SET_API`, ({ countrycode, language, tag } = {}) => {
  const search = { hidebroken: true }

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
    payload: {
      type: `stations`,
      search,
    }
  }
})

// set "stations" list
export const setStationsList = createAction(`SET_STATIONS_LIST`)
