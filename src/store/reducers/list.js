const initialState = () => {
  const lastStateString = localStorage.getItem(`list`)

  if (lastStateString) {
    return JSON.parse(lastStateString)
  }

  const newState = {
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
  }

  return newState
}

export default (state = initialState(), { type, payload }) => {
  let {
    show,
    countrycodes,
    languages,
    tags,
    stations,
    start,
  } = state

  switch (type) {
    case `SET_COUNTRY_CODES`: {
      countrycodes = payload
      show = `countrycodes`
      break
    }

    case `SET_LANGUAGES`: {
      languages = payload
      show = `languages`
      break
    }

    case `SET_TAGS`: {
      tags = payload
      show = `tags`
      break
    }

    case `SET_STATIONS`: {
      stations = payload
      show =  `stations`
      break
    }

    default:
      break
  }

  const newState = {
    show,
    countrycodes,
    languages,
    tags,
    stations,
    start,
  }

  localStorage.setItem(`list`, JSON.stringify(newState))
  return newState
}
