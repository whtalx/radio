const initialState = () => ({
  tags: [],
  show: `start`,
  history: [`start`],
  stations: [],
  languages: [],
  lastSearch: {},
  countrycodes: [],
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
  let {
    tags,
    show,
    start,
    history,
    stations,
    languages,
    lastSearch,
    countrycodes,
  } = state

  switch (type) {
    case `SET_COUNTRY_CODES`: {
      countrycodes = payload
      show = `countrycodes`
      history = history.splice(0, 1)
      history.push(show)
      break
    }

    case `SET_LANGUAGES`: {
      languages = payload
      show = `languages`
      history = history.splice(0, 1)
      history.push(show)
      break
    }

    case `SET_TAGS`: {
      tags = payload
      show = `tags`
      history = history.splice(0, 1)
      history.push(show)
      break
    }

    case `SET_STATIONS`: {
      stations = payload
      show =  `stations`
      history = history.splice(0, 2)
      history.push(show)
      break
    }

    case `LIST_BACK`: {
      const index = history.findIndex(i => i === show) - 1

      if (index >= 0) {
        show = history[index]
      }

      break
    }

    case `LIST_FORWARD`: {
      const index = history.findIndex(i => i === show) + 1

      if (index < history.length) {
        show = history[index]
      }

      break
    }

    case `SHOW`: {
      show = payload
      break
    }

    case `SET_ALL`: {
      lastSearch = payload.search
      break
    }

    default:
      break
  }

  const newState = {
    tags,
    show,
    start,
    history,
    stations,
    languages,
    lastSearch,
    countrycodes,
  }

  return newState
}
