const initialState = () => {
  const lastList = localStorage.getItem(`list`)

  if (lastList) return { ...JSON.parse(lastList), visible: false }

  return {
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
}

export default (state = initialState(), { type, payload }) => {
  let {
    tags,
    show,
    start,
    visible,
    history,
    stations,
    languages,
    lastSearch,
    favourites,
    countrycodes,
    showFavourites,
  } = state

  let changed = false

  switch (type) {
    case `SET_COUNTRY_CODES`: {
      countrycodes = payload
      show = `countrycodes`
      history = history.splice(0, 1)
      history.push(show)
      changed = true
      break
    }

    case `SET_LANGUAGES`: {
      languages = payload
      show = `languages`
      history = history.splice(0, 1)
      history.push(show)
      changed = true
      break
    }

    case `SET_TAGS`: {
      tags = payload
      show = `tags`
      history = history.splice(0, 1)
      history.push(show)
      changed = true
      break
    }

    case `SET_STATIONS`: {
      stations = payload
      show =  `stations`
      history = history.splice(0, 2)
      history.push(show)
      changed = true
      break
    }

    case `LIST_BACK`: {
      const index = history.findIndex(i => i === show) - 1

      if (index >= 0) {
        show = history[index]
        changed = true
      }

      break
    }

    case `LIST_FORWARD`: {
      const index = history.findIndex(i => i === show) + 1

      if (index < history.length) {
        show = history[index]
        changed = true
      }

      break
    }

    case `SHOW`: {
      show = payload
      changed = true
      break
    }

    case `SET_ALL`: {
      lastSearch = payload.search
      changed = true
      break
    }

    case `SET_STATION`: {
      const index = favourites.findIndex(station => station.id === payload.id)

      if (index >= 0) {
        favourites[index] = payload
      }

      stations[stations.findIndex(station => station.id === payload.id)] = payload
      changed = true
      break
    }

    case `TOGGLE_LIST`: {
      visible = !visible
      changed = true
      break
    }

    case `ADD_FAVOURITE`: {
      favourites.push(payload)
      changed = true
      break
    }

    case `REMOVE_FAVOURITE`: {
      const index = favourites.findIndex(station => station.id === payload.id)

      if (index >= 0) {
        favourites.splice(index, 1)
        changed = true
      }

      break
    }

    case `TOGGLE_FAVOURITES`: {
      showFavourites = !showFavourites
      changed = true
      break
    }

    default:
      break
  }

  const list = {
    tags,
    show,
    start,
    visible,
    history,
    stations,
    languages,
    lastSearch,
    favourites,
    countrycodes,
    showFavourites,
  }

  changed && localStorage.setItem(`list`, JSON.stringify(list))

  return list
}
