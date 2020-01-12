import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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

const actualize = (element, history) => {
  history = history.splice(0, element === `stations` ? 2 : 1)
  history.push(element)
  return history
}

const list =  createSlice({
  name: `list`,
  initialState,
  reducers: {
    setList: (state, { payload }) => payload,

    setApi: (state, { payload }) => {
      state.lastSearch = payload.search
    },

    setStation: (state, { payload }) => {
      const station = ({ id }) => id === payload.id
      const index = state.favourites.findIndex(station)

      if (index >= 0) {
        state.favourites[index] = payload
      }

      state.stations[state.stations.findIndex(station)] = payload
    },

    listToggle: (state) => {
      state.visible = !state.visible
    },

    listBack: (state, { payload }) => {
      const index = state.history.findIndex(i => i === state.show) - 1

      if (index >= 0) {
        state.show = state.history[index]
      }
    },

    listForward: (state, { payload }) => {
      const index = state.history.findIndex(i => i === state.show) + 1

      if (index < state.history.length) {
        state.show = state.history[index]
      }
    },

    listShow: (state, { payload }) => {
      state.show = payload
    },

    listSetTags: (state, { payload }) => {
      state.show = `tags`
      state.history = actualize(state.show, state.history)
      state.tags = payload
      state.languages = []
      state.countrycodes = []
    },

    listSetLanguages: (state, { payload }) => {
      state.show = `languages`
      state.history = actualize(state.show, state.history)
      state.tags = []
      state.languages = payload
      state.countrycodes = []
    },

    listSetCountryCodes: (state, { payload }) => {
      state.show = `countrycodes`
      state.history = actualize(state.show, state.history)
      state.tags = []
      state.languages = []
      state.countrycodes = payload
    },

    listSetStations: (state, { payload }) => {
      state.show = `stations`
      state.history = actualize(state.show, state.history)
      state.stations = payload
    },

    favouritesToggle: (state) => {
      state.showFavourites = !state.showFavourites
    },

    favouritesRemove: (state, { payload }) => {
      const index = state.favourites.findIndex(({ id }) => id === payload.id)

      if (index >= 0) {
        state.favourites.splice(index, 1)
      }
    },

    favouritesAdd: (state, { payload }) => {
      state.favourites.push(payload)
    },
  },
})

export const {
  setList,
  setApi,
  setStation,
  listToggle,
  listBack,
  listForward,
  listShow,
  listSetTags,
  listSetLanguages,
  listSetCountryCodes,
  listSetStations,
  favouritesToggle,
  favouritesRemove,
  favouritesAdd,
} = list.actions
export default list.reducer
