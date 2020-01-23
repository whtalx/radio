import { Transform } from 'stream'

const INIT = 1
const BUFFERING = 2
const PASSTHROUGH = 3

const _parseMetadata = metadata => {
  return (Buffer.isBuffer(metadata) ? metadata.toString() : metadata || ``)
    .replace(/0*$/, ``)
    .split(`;`)
    .map((item) => {
      const g = /(?<key>(.+?))=['"](?<value>(.+?)?)['"]/.exec(item)
      return g ? { [g.groups.key]: g.groups.value } : undefined
    })
    .reduce((metadata, item) => item ? { ...metadata, ...item } : metadata, {})
}

const _trampoline = function (fn) {
  return function () {
    let result = fn.apply(this, arguments)
    while (typeof result === `function`) result = result()
    return result
  }
}

const _processData = (stream, chunk, done) => {
  if (stream._bytesLeft) {
    stream._bytesLeft -= chunk.length
  }

  if (stream._currentState === BUFFERING) {
    stream._buffers.push(chunk)
    stream._buffersLength += chunk.length
  } else if (stream._currentState === PASSTHROUGH) {
    stream.push(chunk)
  }

  if (stream._bytesLeft === 0) {
    const cb = stream._callback

    if (cb && stream._currentState === BUFFERING && stream._buffers.length > 1) {
      chunk = Buffer.concat(stream._buffers, stream._buffersLength)
    } else if (stream._currentState !== BUFFERING) {
      chunk = null
    }

    stream._currentState = INIT
    stream._callback = null
    stream._buffers.splice(0)
    stream._buffersLength = 0

    cb.call(stream, chunk)
  }

  return done
}

const _onData = _trampoline((stream, chunk, done) =>
  chunk.length <= stream._bytesLeft
    ? () => _processData(stream, chunk, done)
    : () => {
      const buffer = chunk.slice(0, stream._bytesLeft)

      return _processData(stream, buffer, (error) =>
        error
          ? done(error)
          : chunk.length > buffer.length
            ? () => _onData(stream, chunk.slice(buffer.length), done)
            : undefined
      )
    }
)

export default class StreamReader extends Transform {
  constructor (icyMetaInt) {
    super()

    this._bytesLeft = 0                     // How many bytes left to read
    this._currentState = INIT               // Current state of reader, what the reader should do with received bytes
    this._callback = null                   // Callback for the next chunk
    this._buffers = []                      // Array of collected Buffers
    this._buffersLength = 0                 // How many bytes already read
    this._icyMetaInt = parseInt(icyMetaInt) // icy-metaint number from radio response

    this._passthrough(this._icyMetaInt, this._onMetaSectionStart)
  }

  _bytes (length, cb) {
    this._bytesLeft = length
    this._currentState = BUFFERING
    this._callback = cb
    return this
  }

  _passthrough (length, cb) {
    this._bytesLeft = length
    this._currentState = PASSTHROUGH
    this._callback = cb
    return this
  }

  _transform (chunk, encoding, done) {
    _onData(this, chunk, done)
  }

  _onMetaSectionStart () {
    this._bytes(1, this._onMetaSectionLengthByte)
  }

  _onMetaSectionLengthByte (chunk) {
    const length = chunk[0] * 16

    if (length > 0) {
      this._bytes(length, this._onMetaData)
    } else {
      this._passthrough(this._icyMetaInt, this._onMetaSectionStart)
    }
  }

  _onMetaData (chunk) {
    this.emit('metadata', _parseMetadata(chunk))
    this._passthrough(this._icyMetaInt, this._onMetaSectionStart)
  }
}
