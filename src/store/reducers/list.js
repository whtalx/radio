import storage from 'electron-json-storage'

export default (state = {}, { type, payload }) => {
  let {
    show,
    history,
    lastSearch,
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
    show,
    history,
    lastSearch,
    countrycodes,
    languages,
    tags,
    stations,
    start,
  }

  storage.set(`list`, newState, console.warn)
  return newState
}
