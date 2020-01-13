import { createAction } from '@reduxjs/toolkit'

// set "player" store state
export const setPlayer = createAction(`SET_PLAYER`)

// station player currently playing
export const setPlaying = createAction(`SET_PLAYING`)

// set player current state ("loading" / "playing" / "paused")
export const setState = createAction(`PLAYER_SET_STATE`)
