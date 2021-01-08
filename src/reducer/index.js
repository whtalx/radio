import { createContext } from 'react'
import produce from 'immer'

import windowReducer from './window'
import playerReducer from './player'
import { void0 } from '../functions'

export const initialState = {
  player: { currentState: `stopped`, volume: .5 },
  window: { drawer: false, locale: `en` },
}

export const State = createContext({
  state: initialState,
})

export const Dispatch = createContext({
  dispatch: void0,
})

function masterReducer(draft, action) {
  playerReducer(draft.player, action)
  windowReducer(draft.window, action)
}

export default produce(masterReducer)
