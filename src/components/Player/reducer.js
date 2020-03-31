const player = {
  currentState: `paused`,
  playing: {},
  volume: 75,
  pan: 0,
}

export const initialState = {
  ...player,
  ...JSON.parse(localStorage.player || `null`),
  currentState: `paused`,
}

export function reducer(state, { type, payload }) {
  switch (type) {
    case `UPDATE_STATION`:
      return payload.src_resolved
        ? {
          ...state,
          currentState: `pending`,
          playing: payload,
        }
        : state

    case `SET_PLAYING`:
      return {
        ...state,
        currentState: payload.id ? `pending` : `paused`,
        playing: payload,
      }

    case `SET_STATE`:
      return {
        ...state,
        currentState: payload,
      }

    case `SET_VOLUME`:
      return {
        ...state,
        volume: payload,
      }

    case `SET_PAN`:
      return {
        ...state,
        pan: payload,
      }

    default:
      return state
  }
}