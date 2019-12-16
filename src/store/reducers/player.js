const initialState = () => {
  const context = new AudioContext()
  const element = document.createElement(`AUDIO`)
  const source = context.createMediaElementSource(element)
  const analyser = context.createAnalyser()
  element.crossOrigin = ``
  // const frequencyArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.fftSize = 256
  analyser.minDecibels = -90
  analyser.maxDecibels = -30
  analyser.smoothingTimeConstant = 0.95
  source.connect(analyser)
  analyser.connect(context.destination)

  return {
    context,
    element,
    analyser,
    // frequencyArray,
  }
}

export default (state = initialState(), action) => {
  switch (action.type) {
    case `CHANGE_SOURCE`: {
      const newState = { ...state }
      newState.element.children.length &&
        newState.element.children.item(0).remove()

      if (action.payload) {
        const source = document.createElement(`SOURCE`)
        source.src = action.payload
        newState.element.appendChild(source)
      }

      return newState
    }

    // case `GET_BYTE_FREQUENCY_DATA`: {
    //   const newState = { ...state }
    //   newState.analyser.getByteFrequencyData(newState.frequencyArray)
    //   return newState
    // }

    default:
      return state
  }
}
