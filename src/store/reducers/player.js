import error from '../../App/functions/error'

const initialState = () => {
  const context = new AudioContext()

  const element = document.createElement(`AUDIO`)
  element.crossOrigin = ``
  element.preload = `metadata`
  element.onabort = error
  element.onerror = error
  element.oncanplay = () => {
    element.play().catch(error)
  }

  const analyser = context.createAnalyser()
  analyser.fftSize = 2048
  analyser.minDecibels = -90
  analyser.maxDecibels = -20
  analyser.smoothingTimeConstant = .88

  const source = context.createMediaElementSource(element)
  source.connect(analyser)

  return {
    context,
    element,
    analyser,
    station: element.currentSrc
  }
}

export default (state = initialState(), { type, payload }) => {
  let {
    context,
    element,
    analyser,
    station,
  } = state

  switch (type) {
    case `SET_STATION`: {
      station = payload
      element.src = payload
      element.play()
      break
    }

    case `SET_VISUALIZATION`: {
      element.onplaying = payload
      analyser.connect(context.destination)
      break
    }

    default:
      break
  }

  return {
    context,
    element,
    analyser,
    station,
  }
}
