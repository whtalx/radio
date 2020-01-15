import { createReducer } from '@reduxjs/toolkit'
import { updateStation } from '../actions/list'
import { setPlaying, setState } from '../actions/player'

export default createReducer(
  {
    currentState: `paused`,
    playing: {},
  },
  {
    [updateStation]: (state, { payload }) => ({
      currentState: payload.src_resolved ? `pending` : state.currentState,
      playing: payload.src_resolved ? payload : state.playing
    }),

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
