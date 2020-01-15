import { createReducer } from '@reduxjs/toolkit'
import { setPlaying, setState } from '../actions/player'

export default createReducer(
  {
    currentState: `paused`,
    playing: {},
  },
  {
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
