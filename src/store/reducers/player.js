import error from '../../App/functions/error'

const initialState = () => {
  const context = new AudioContext()

  const element = document.createElement(`AUDIO`)
  element.crossOrigin = ``
  element.preload = `all`
  element.onerror = error
  element.onabort = ({ target }) => {
    console.log(`aborted: `, target.src)
  }
  element.onloadstart = ({ target }) => {
    console.log(`loading: `, target.src)
  }
  element.onloadedmetadata = ({ target }) => {
    console.log(`playing: `, target.src)
  }
  element.oncanplay = () => {
    element.play()//.catch(error)
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
  }
}

export default (state = initialState(), { type, payload }) => {
  let {
    context,
    element,
    analyser,
  } = state

  switch (type) {
    case `SET_STATION`: {
      element.src = payload
      element.load()
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
  }
}
