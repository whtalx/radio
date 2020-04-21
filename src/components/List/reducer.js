const api = {
  protocol: `https:/`,
  server: `de1.api.radio-browser.info`,
  data: `json`,
  type: null,
  search: null,
}

const list = {
  tags: [],
  show: `start`,
  visible: false,
  history: [`start`],
  stations: [],
  languages: [],
  lastSearch: {},
  favourites: [],
  countrycodes: [],
  showFavourites: false,
  start: [
    {
      name: `by countries`,
      type: `countrycodes`,
    },
    {
      name: `by languages`,
      type: `languages`,
    },
    {
      name: `by tags`,
      type: `tags`,
    },
  ],
}

export const initialState = {
  api,
  list: {
    ...list,
    ...JSON.parse(localStorage.list || `null`),
  },
}

export function reducer(state, { type, payload }) {
  switch (type) {
    case `SET_API`: {
      const { api, list } = state
      const { countrycode, language, tag } = payload
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

      api.search = search
      api.type = `stations`
      list.lastSearch = search

      return { list, api }
    }

    case `SET_STATIONS_LIST`: {
      const { api, list } = state
      api.type = null
      list.show = `stations`
      list.history = actualize(list.show, list.history)
      list.stations = payload
      return { api, list }
    }

    case `SET_TYPE`: {
      const { api, list } = state
      api.type = payload
      api.search = null
      return { api, list }
    }

    case `UPDATE_STATION`: {
      const { api, list } = state
      const station = ({ id }) => id === payload.id
      const index = list.favourites.findIndex(station)

      if (index >= 0) {
        list.favourites[index] = payload
      }

      list.stations[list.stations.findIndex(station)] = payload
      return { api, list }
    }

    case `LIST_TOGGLE`: {
      const { api, list } = state
      list.visible = !list.visible
      return { api, list }
    }

    case `HISTORY_BACK`: {
      const { api, list } = state
      const index = list.history.findIndex(i => i === list.show) - 1

      if (index >= 0) {
        list.show = list.history[index]
      }
      return { api, list }
    }

    case `HISTORY_FORWARD`: {
      const { api, list } = state
      const index = list.history.findIndex(i => i === list.show) + 1

      if (index < list.history.length) {
        list.show = list.history[index]
      }
      return { api, list }
    }

    case `SHOW`: {
      const { api, list } = state
      list.show = payload
      return { api, list }
    }

    case `SET_TAGS_LIST`: {
      const { api, list } = state
      list.show = `tags`
      list.history = actualize(list.show, list.history)
      list.tags = payload
      list.languages = []
      list.countrycodes = []
      return { api, list }
    }

    case `SET_LANGUAGES_LIST`: {
      const { api, list } = state
      list.show = `languages`
      list.history = actualize(list.show, list.history)
      list.tags = []
      list.languages = payload
      list.countrycodes = []
      return { api, list }
    }

    case `SET_COUNTRY_CODES_LIST`: {
      const { api, list } = state
      list.show = `countrycodes`
      list.history = actualize(list.show, list.history)
      list.tags = []
      list.languages = []
      list.countrycodes = payload
      return { api, list }
    }

    case `FAVOURITES_TOGGLE`: {
      const { api, list } = state
      list.showFavourites = !list.showFavourites
      return { api, list }
    }

    case `FAVOURITES_REMOVE`: {
      const { api, list } = state
      const index = list.favourites.findIndex(({ id }) => id === payload.id)
      index >= 0 && list.favourites.splice(index, 1)
      return { api, list }
    }

    case `FAVOURITES_ADD`: {
      const { api, list } = state
      payload.id && list.favourites.push(payload)
      return { api, list }
    }

    case `TOGGLE_FAVOURITE`: {
      const { api, list } = state
      const index = payload.id ? list.favourites.findIndex(({ id }) => id === payload.id) : -1
      index >= 0
        ? list.favourites.splice(index, 1)
        : list.favourites.push(payload)
      return { api, list }
    }

    default:
      return state
  }
}

function actualize(element, history) {
  const h = history.splice(0, element === `stations` ? 2 : 1)
  h.push(element)
  return h
}

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