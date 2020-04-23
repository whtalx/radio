import { createReducer } from '@reduxjs/toolkit'
import {
  show,
  setApi,
  listToggle,
  historyBack,
  setTagsList,
  updateStation,
  favouritesAdd,
  historyForward,
  toggleFavourite,
  setStationsList,
  setLanguagesList,
  favouritesToggle,
  favouritesRemove,
  setCountryCodesList,
} from '../actions'

const actualize = (element, history) => {
  history = history.splice(0, element === `stations` ? 2 : 1)
  history.push(element)
  return history
}

export const list = createReducer(
  {
    tags: [],
    show: `start`,
    lastShow: null,
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
  },
  {
    [setApi]: (state, { payload }) => {
      state.lastSearch = payload.search
    },

    [setStationsList]: (state, { payload }) => {
      state.show = `stations`
      state.history = actualize(state.show, state.history)
      state.stations = payload
    },

    [updateStation]: (state, { payload }) => {
      const station = ({ id }) => id === payload.id
      const index = state.favourites.findIndex(station)

      if (index >= 0) {
        state.favourites[index] = payload
      }

      state.stations[state.stations.findIndex(station)] = payload
    },

    [listToggle]: (state) => ({
      ...state,
      visible: !state.visible
    }),

    [historyBack]: (state) => {
      const index = state.history.findIndex(i => i === state.show) - 1

      if (index >= 0) {
        state.show = state.history[index]
      }
    },

    [historyForward]: (state) => {
      const index = state.history.findIndex(i => i === state.show) + 1

      if (index < state.history.length) {
        state.show = state.history[index]
      }
    },

    [show]: (state, { payload }) => {
      state.show = payload
    },

    [setTagsList]: (state, { payload }) => {
      state.show = `tags`
      state.history = actualize(state.show, state.history)
      state.tags = payload
      state.languages = []
      state.countrycodes = []
    },

    [setLanguagesList]: (state, { payload }) => {
      state.show = `languages`
      state.history = actualize(state.show, state.history)
      state.tags = []
      state.languages = payload
      state.countrycodes = []
    },

    [setCountryCodesList]: (state, { payload }) => {
      state.show = `countrycodes`
      state.history = actualize(state.show, state.history)
      state.tags = []
      state.languages = []
      state.countrycodes = payload
    },

    [favouritesToggle]: (state) => {
      if (state.showFavourites) {
        state.show = state.lastShow
        state.lastShow = null
      } else {
        state.lastShow = state.show
        state.show = `favourites`
      }

      state.showFavourites = !state.showFavourites
    },

    [favouritesRemove]: (state, { payload }) => {
      const index = state.favourites.findIndex(({ id }) => id === payload.id)

      if (index >= 0) {
        state.favourites.splice(index, 1)
      }
    },

    [favouritesAdd]: (state, { payload }) => {
      payload.id && state.favourites.push(payload)
    },

    [toggleFavourite]: (state, { payload }) => {
      const index = state.favourites.findIndex(({ id }) => id === payload.id)

      index >= 0
        ? state.favourites.splice(index, 1)
        : state.favourites.push(payload)
    }
  },
)
