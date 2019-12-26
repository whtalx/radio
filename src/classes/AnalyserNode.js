export default class AnalyserNode {
  constructor({ context, stc }) {
    const node = context.createAnalyser()
    node.fftSize = 2048
    node.minDecibels = -90
    node.maxDecibels = -20
    node.smoothingTimeConstant = stc
    return node
  }
}
