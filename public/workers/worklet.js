class GainProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: `gain`, defaultValue: 1 }]
  }

  constructor() {
    super()
    this.port.postMessage(`it's alive!`)
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]
    const output = outputs[0]
    // const gain = parameters.gain
    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel]
      const outputChannel = output[channel]
      // const step = Math.pow(.5, 4)
      for (let i = 0; i < inputChannel.length; ++i)
        // outputChannel[i] = step * Math.floor(inputChannel[i] / step + .5)
        outputChannel[i] = inputChannel[i]
    }

    return true
  }
}

registerProcessor(`gain-processor`, GainProcessor)
