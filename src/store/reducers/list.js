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
  const showList = (elem) => {
    show = elem
    history = history.splice(0, elem === `stations` ? 2 : 1)
    history.push(elem)
    changed = true
  }

  switch (type) {
    case `SET_COUNTRY_CODES`: {
      tags = []
      languages = []
      countrycodes = payload
      showList(`countrycodes`)
      break
    }

    case `SET_LANGUAGES`: {
      tags = []
      languages = payload
      countrycodes = []
      showList(`languages`)
      break
    }

    case `SET_TAGS`: {
      tags = payload
      languages = []
      countrycodes = []
      showList(`tags`)
      break
    }

    case `SET_STATIONS`: {
      stations = payload
      showList(`stations`)
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
