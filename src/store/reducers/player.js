const initialState = () => {
  const lastState = localStorage.getItem(`lastState`)
  const lastStation = localStorage.getItem(`lastStation`)

  return {
    lastState: lastState ? JSON.parse(lastState) : `paused`,
    lastStation: lastStation ? JSON.parse(lastStation) : {},
  }
}

export default (state = initialState(), { type, payload }) => {
  switch (type) {
    case `SET_LAST_STATE`: {
      const lastState = payload
      localStorage.setItem(`lastState`, JSON.stringify(lastState))
      return {
        ...state,
        lastState,
      }
    }

    case `SET_LAST_STATION`: {
      const lastStation = payload
      localStorage.setItem(`lastStation`, JSON.stringify(lastStation))
      return {
        ...state,
        lastStation,
      }
    }

    default:
      return state
  }
}
