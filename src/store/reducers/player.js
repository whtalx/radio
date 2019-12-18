import error from "../../App/functions/error"

const initialState = () => {
  const context = new AudioContext()
  const element = document.createElement(`AUDIO`)
  const source = context.createMediaElementSource(element)
  const analyser = context.createAnalyser()
  element.crossOrigin = ``
  element.onloadeddata = () => {
    element.play().then(() => false)
  }
  element.onabort = () => false
  element.onerror = error
  // element.onsuspend = ({ target: { readyState, currentSrc } }) => {
  //   if (readyState !== 0) return
  //
  //   element.src = /\/source+$/.test(currentSrc)
  //     ? ``
  //     : `${ element.currentSrc.replace(/[/]+$/g, ``) }/stream`
  //
  //   element.load()
  // }

  analyser.fftSize = 2048
  analyser.minDecibels = -90
  analyser.maxDecibels = -20
  analyser.smoothingTimeConstant = .88
  source.connect(analyser)
  analyser.connect(context.destination)

  return {
    context,
    element,
    analyser,
    station: element.currentSrc
  }
}

export default (state = initialState(), { type, payload }) => {
  switch (type) {
    case `SET_STATION`: {
      const newState = { ...state }
      newState.station = payload

      if (payload === ``) {
        newState.element.pause()
      } else {
        newState.element.src = payload
        newState.element.play()
      }

      return newState
    }

    case `SET_VISUALIZATION`: {
      const newState = { ...state }
      newState.element.onplaying = payload
      return newState
    }

    default:
      return state
  }
}
