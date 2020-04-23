import { createAction } from '@reduxjs/toolkit'

// set "tags" list
export const setTagsList = createAction(`SET_TAGS_LIST`)

// show/hide list component
export const listToggle = createAction(`LIST_TOGGLE`)

// show previous list
export const historyBack = createAction(`HISTORY_BACK`)

// show next list
export const historyForward = createAction(`HISTORY_FORWARD`)

// show specific list
export const show = createAction(`SHOW`)

// set "languages" list
export const setLanguagesList = createAction(`SET_LANGUAGES_LIST`)

// set "countryCodes" list
export const setCountryCodesList = createAction(`SET_COUNTRY_CODES_LIST`)

// station player currently "tuned" to
export const updateStation = createAction(`UPDATE_STATION`)

// show/hide favourites list
export const favouritesToggle = createAction(`FAVOURITES_TOGGLE`)

// remove station from favourites list
export const favouritesRemove = createAction(`FAVOURITES_REMOVE`)

// add station to favourites list
export const favouritesAdd = createAction(`FAVOURITES_ADD`)

export const toggleFavourite = createAction(`TOGGLE_FAVOURITE`)
