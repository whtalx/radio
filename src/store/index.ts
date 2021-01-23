import { createContext } from 'react'
import produce from 'immer'

import windowReducer from './windowReducer'
import playerReducer from './playerReducer'
import { void0 } from '../functions'

export interface PlayerState {
  currentState: string,
  volume: number,
  station?: {
    title: string,
    info: {
      bitrate: number,
      samplerate: number,
      channels: number,
      type: string,
      favourite: boolean,
    },
  },
  isMuted?: boolean,
}

export interface WindowState {
  drawer: boolean,
  locale: string,
  [index: string]: any,
}

export type StateType = {
  player: PlayerState,
  window: WindowState,
}

export type ActionType = {
  type: string,
  payload?: boolean | string | number | WindowState,
}

export const initialState: StateType = {
  player: { currentState: `stopped`, volume: .5 },
  window: { drawer: false, locale: `en` },
}

type DispatchContextType = (a: ActionType) => void

export const StateContext = createContext<StateType>(initialState)

export const DispatchContext = createContext<DispatchContextType>(void0)

function masterReducer(draft: StateType, action: ActionType) {
  playerReducer(draft.player, action)
  windowReducer(draft.window, action)
}

export default produce(masterReducer)
