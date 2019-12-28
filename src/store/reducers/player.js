const initialState = () => {
  const currentState = localStorage.getItem(`currentState`)
  const playing = localStorage.getItem(`playing`)

  return {
    currentState: currentState ? JSON.parse(currentState) : `paused`,
    playing: playing ? JSON.parse(playing) : {},
  }
}

export default (state = initialState(), { type, payload }) => {
  switch (type) {
    case `SET_CURRENT_STATE`: {
      const currentState = payload
      localStorage.setItem(`currentState`, JSON.stringify(currentState))
      return {
        ...state,
        currentState,
      }
    }

    case `SET_PLAYING`: {
      const station = payload
      localStorage.setItem(`playing`, JSON.stringify(station))
      return {
        ...state,
        playing: station,
      }
    }

    default:
      return state
  }
}
