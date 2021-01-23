import { PlayerState, ActionType } from '.'

const INFO = {
  bitrate: 256,
  samplerate: 44100,
  channels: 2,
  type: `mp3`,
  favourite: true,
}

const TITLE = `Lorem ipsum dolor sit amet consectetur adipiscing elit Integer nec odio Praesent libero Sed cursus ante dapibus diam Sed nisi Nulla quis sem at nibh elementum imperdiet`

export default function playerReducer(draft: PlayerState, action: ActionType): void {
  switch (action.type) {
    case `play`: {
      draft.currentState = `playing`
      draft.station = {
        title: TITLE,
        info: INFO,
      }

      break
    }

    case `stop`: {
      draft.currentState = `stopped`
      draft.station = undefined
      break
    }

    case `volume`: {
      if (typeof action.payload === 'number') {
        draft.volume = action.payload
      }

      break
    }

    case `mute`: {
      draft.isMuted = action.payload ? true : undefined
      break
    }

    default:
      break
  }
}
