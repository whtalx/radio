import { Transform } from 'stream'

const INIT = 1
const BUFFERING = 2
const PASSTHROUGH = 3

export class StreamReader extends Transform {
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

  _bytes(length, cb) {
    this._bytesLeft = length
    this._currentState = BUFFERING
    this._callback = cb
    return this
  }

  _passthrough(length, cb) {
    this._bytesLeft = length
    this._currentState = PASSTHROUGH
    this._callback = cb
    return this
  }

  _transform(chunk, encoding, done) {
    onData(this, chunk, done)
  }

  _onMetaSectionStart() {
    this._bytes(1, this._onMetaSectionLengthByte)
  }

  _onMetaSectionLengthByte(chunk) {
    chunk[0] * 16 > 0
      ? this._bytes(chunk[0] * 16, this._onMetaData)
      : this._passthrough(this._icyMetaInt, this._onMetaSectionStart)
  }

  _onMetaData(chunk) {
    this.emit(`metadata`, parseMetadata(chunk))
    this._passthrough(this._icyMetaInt, this._onMetaSectionStart)
  }
}

function parseMetadata(metadata) {
  return (Buffer.isBuffer(metadata) ? metadata.toString() : metadata || ``)
    .replace(/0*$/, ``)
    .split(`;`)
    .map((item) => {
      const g = /(?<key>(.+?))=['"](?<value>(.+?)?)['"]$/.exec(item)
      return g ? { [g.groups.key]: g.groups.value } : undefined
    })
    .reduce((metadata, item) => item ? { ...metadata, ...item } : metadata, {})
}

function processData(stream, chunk, done) {
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

function onData(stream, chunk, done) {
  const buffer = chunk.slice(0, stream._bytesLeft)
  let result = chunk.length <= stream._bytesLeft
    ? processData(stream, chunk, done)
    : processData(stream, buffer, (error) =>
      error
        ? done(error)
        : chunk.length > buffer.length
          ? () => onData(stream, chunk.slice(buffer.length), done)
          : undefined
    )

  while (typeof result === `function`) result = result()

  return result
}
