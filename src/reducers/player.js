import { createReducer } from '@reduxjs/toolkit'
import { updateStation } from '../actions/list'
import { setPlaying, setState, setVolume } from '../actions/player'

export default createReducer(
  {
    currentState: `paused`,
    playing: {},
    volume: 75,
  },
  {
    [updateStation]: (state, { payload }) => ({
      ...state,
      currentState: payload.src_resolved ? `pending` : state.currentState,
      playing: payload.src_resolved ? payload : state.playing
    }),

    [setPlaying]: (state, { payload }) => ({
      ...state,
      currentState: payload.id ? `pending` : `paused`,
      playing: payload
    }),

    [setState]: (state, { payload }) => ({
      ...state,
      currentState: payload,
    }),

    [setVolume]: (state, { payload }) => ({
      ...state,
      volume: payload,
    }),
  }
)
