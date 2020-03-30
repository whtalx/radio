import { createAction } from '@reduxjs/toolkit'

// station player currently playing
export const setPlaying = createAction(`SET_PLAYING`)

// set player current state ("loading" / "playing" / "paused")
export const setState = createAction(`PLAYER_SET_STATE`)

export const setVolume = createAction(`PLAYER_SET_GAIN`)

export const setPan = createAction(`PLAYER_SET_PAN`)
