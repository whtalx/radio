import { createReducer } from '@reduxjs/toolkit'
import { setApi, setStationsList } from '../actions/common'
import { setType } from '../actions/api'

/*
const types = [
  `countries`,
  `countrycodes`,
  `languages`,
  `stations`, // this works with stationQueries like { type: `stations/bycountry/japan` } or with search like { type: `stations`, search: { ...searchQueries }}
  `servers`,
  `url/${ stationid }`,
  `tags`,
]

const stationQueries = [
  `byid`,
  `byuuid`,
  `byname`,
  `bynameexact`,
  `bycodec`,
  `bycodecexact`,
  `bycountry`,
  `bycountryexact`,
  `bycountrycodeexact`,
  `bystate`,
  `bystateexact`,
  `bylanguage`,
  `bylanguageexact`,
  `bytag`,
  `bytagexact`,
  `search`,
]

const searchQueries = {
  name: ``              // STRING, name of the station
  nameExact: false      // BOOL, true: only exact matches, otherwise all matches.
  country: ``           // STRING, country of the station
  countryExact: false   // BOOL, true: only exact matches, otherwise all matches.
  countrycode: ``       // STRING, 2-digit country code of the station (see ISO 3166-1 alpha-2).
  state: ``             // STRING, state of the station
  stateExact: false     // BOOL, true: only exact matches, otherwise all matches.
  language: ``          // STRING, language of the station
  languageExact: false  // BOOL, true: only exact matches, otherwise all matches.
  tag: ``               // STRING, a tag of the station
  tagExact: false       // BOO), true: only exact matches, otherwise all matches.
  tagList: ``           // STRING,STRING,..., a comma-separated list of tag. All tags in list have to match.
  bitrateMin: 0         // POSITIVE INTEGER, minimum of kbps for bitrate field of stations in result
  bitrateMax: 1000000   // POSITIVE INTEGER, maximum of kbps for bitrate field of stations in result
  order: ``             // STRING, see orders below. name of the attribute the result list will be sorted by
  reverse: false        // BOOL, true: reverse the result list
  offset: 0             // POSITIVE INTEGER, starting value of the result list from the database
  limit: 100000         // POSITIVE INTEGER, number of returned data rows (stations) starting with offset
}

const orders = [
  `name`,
  `url`,
  `homepage`,
  `favicon`,
  `tags`,
  `country`,
  `state`,
  `language`,
  `votes`,
  `negativevotes`,
  `codec`,
  `bitrate`,
  `lastcheckok`,
  `lastchecktime`,
  `clicktimestamp`,
  `clickcount`,
  `clicktrend`,
]
*/

export default createReducer(
  {
    protocol: `https:/`,
    server: `de1.api.radio-browser.info`,
    data: `json`,
    type: null,
    search: null,
  },
  {
    [setApi]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),

    [setType]: (state, { payload }) => ({
      ...state,
      type: payload,
      search: null,
    }),

    [setStationsList]: (state) => ({
      ...state,
      type: null,
    }),
  }
)
