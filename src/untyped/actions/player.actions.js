import { createAction } from '@reduxjs/toolkit'

// station player currently playing
export const setPlaying = createAction(`SET_PLAYING`)

// set player current state ("loading" / "playing" / "paused")
export const setState = createAction(`SET_PLAYER_STATE`)

export const setVolume = createAction(`SET_GAIN`)

export const setPan = createAction(`SET_PAN`)

export const setVideoHeight = createAction(`SET_VIDEO_HEIGHT`)
