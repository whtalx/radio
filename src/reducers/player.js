import { createReducer } from '@reduxjs/toolkit'
import { setPlayer, setPlaying, setState } from '../actions/player'

export default createReducer(
  {
    currentState: `paused`,
    playing: {},
  },
  {
    [setPlayer]: (state, { payload }) => payload,

    [setPlaying]: (state, { payload }) => ({
      currentState: payload.id ? `pending` : `paused`,
      playing: payload
    }),

    [setState]: (state, { payload }) => ({
      ...state,
      currentState: payload,
    }),
  }
)
