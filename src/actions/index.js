import { createAction } from '@reduxjs/toolkit'

// set "search" store.api state
export function setApi({ countrycode, language, tag }) {
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

  return createAction(`SET_API`)({
    type: `stations`,
    search,
  })
}

// set "list" store state
export function setList(state) {
  return createAction(`SET_LIST`)(state)
}

// station player currently "tuned" to
export function setStation(station) {
  return createAction(`SET_STATION`)(station)
}

// station player currently playing
export function setPlaying(station) {
  return createAction(`SET_PLAYING`)(station)
}

// create object for "country codes"/"languages"/"tags" request
export function apiSetType(type) {
  return createAction(`API_SET_TYPE`)(type)
}

// show/hide list component
export function listToggle() {
  return createAction(`LIST_TOGGLE`)()
}

// show previous list
export function listBack() {
  return createAction(`LIST_BACK`)()
}

// show next list
export function listForward() {
  return createAction(`LIST_FORWARD`)()
}

// show specific list
export function listShow(list) {
  return createAction(`LIST_SHOW`)(list)
}

// set "tags" list
export function listSetTags(tags) {
  return createAction(`LIST_SET_TAGS`)(tags)
}

// set "languages" list
export function listSetLanguages(languages) {
  return createAction(`LIST_SET_LANGUAGES`)(languages)
}

// set "countryCodes" list
export function listSetCountryCodes(countryCodes) {
  return createAction(`LIST_SET_COUNTRY_CODES`)(countryCodes)
}

// set "stations" list
export function listSetStations(stations) {
  return createAction(`LIST_SET_STATIONS`)(stations)
}

// show/hide favourites list
export function favouritesToggle() {
  return createAction(`FAVOURITES_TOGGLE`)()
}

// remove station from favourites list
export function favouritesRemove(favourite) {
  return createAction(`FAVOURITES_REMOVE`)(favourite)
}

// add station to favourites list
export function favouritesAdd(favourite) {
  return createAction(`FAVOURITES_ADD`)(favourite)
}

// set "player" store state
export function setPlayer(state) {
  return createAction(`SET_PLAYER`)(state)
}

// set player current state ("loading"/"playing"/"paused")
export function playerSetState(state) {
  return createAction(`PLAYER_SET_STATE`)(state)
}
