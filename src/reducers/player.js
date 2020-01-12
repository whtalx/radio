import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentState: `paused`,
  playing: {},
}

const player = createSlice({
  name: `player`,
  initialState,
  reducers: {
    setPlayer: (state, { payload }) => payload,

    setPlaying: (state, { payload }) => ({
      ...state,
      playing: payload,
    }),

    playerSetState: (state, { payload }) => ({
      ...state,
      type: payload,
      search: null,
    }),
  }
})

export const { setPlayer, setPlaying, playerSetState } = player.actions
export default player.reducer
