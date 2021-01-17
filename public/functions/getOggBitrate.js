const BITRATE_MAP = {
  '0.0': 64,
  '0.1': 80,
  '0.2': 96,
  '0.3': 112,
  '0.4': 128,
  '0.5': 160,
  '0.6': 192,
  '0.7': 224,
  '0.8': 256,
  '0.9': 320,
  '1.0': 500,
}

export function getOggBitrate(quality) {
  return BITRATE_MAP[quality]
}
