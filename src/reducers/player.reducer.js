import { createReducer } from '@reduxjs/toolkit'
import {
  setPan,
  setState,
  setRandom,
  setVolume,
  setPlaying,
  updateStation,
  setVideoHeight,
} from '../actions'

export const player = createReducer(
  {
    currentState: `paused`,
    videoHeight: 0,
    random: false,
    playing: {},
    volume: 75,
    pan: 0,
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

    [setVideoHeight]: (state, { payload }) => ({
      ...state,
      videoHeight: payload,
    }),

    [setVolume]: (state, { payload }) => ({
      ...state,
      volume: payload,
    }),

    [setPan]: (state, { payload }) => ({
      ...state,
      pan: payload,
    }),

    [setRandom]: (state) => ({
      ...state,
      random: !state.random,
    }),
  }
)
