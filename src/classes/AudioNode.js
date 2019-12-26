import error from '../functions/error'

export default class AudioNode {
  constructor() {
    const node = document.createElement(`AUDIO`)
    node.crossOrigin = ``
    node.preload = `none`
    node.onerror = error
    return node
  }
}
