export function Analyser({
   node,
   fftSize = 2048,
   minDecibels= -90,
   maxDecibels= -20,
   smoothingTimeConstant,
}) {
  node.fftSize = fftSize
  node.minDecibels = minDecibels
  node.maxDecibels = maxDecibels
  node.smoothingTimeConstant = smoothingTimeConstant
  return node
}
