const initialState = () => ({
  show: `start`,
  countrycodes: [],
  languages: [],
  tags: [],
  stations: [],
  start: [
    {
      name: `by countries`,
      action: {
        type: `SET_TYPE`,
        payload: `countrycodes`,
      },
    },
    {
      name: `by languages`,
      action: {
        type: `SET_TYPE`,
        payload: `languages`,
      },
    },
    {
      name: `by tags`,
      action: {
        type: `SET_TYPE`,
        payload: `tags`,
      },
    },
  ],
})

export default (state = initialState(), { type, payload }) => {
  switch (type) {
    case `SET_COUNTRY_CODES`:
      return {
        ...state,
        countrycodes: payload,
        show: `countrycodes`,
      }

    case `SET_LANGUAGES`:
      return {
        ...state,
        languages: payload,
        show: `languages`,
      }

    case `SET_TAGS`:
      return {
        ...state,
        tags: payload,
        show: `tags`,
      }

    case `SET_STATIONS`:
      return {
        ...state,
        stations: payload,
        show: `stations`,
      }

    case `SHOW_LIST`:
      return {
        ...state,
        show: payload,
      }

    default:
      return state
  }
}
