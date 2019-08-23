function binSize(numBins, sampleRate) {
  const maxFreq = sampleRate / 2
  return maxFreq / numBins
}

function getBins(min, max, numBins, binSize) {
  let low = Math.floor(min / binSize) - 1
  low = low > 0 ? low : 0
  const high = Math.floor(max / binSize) - 1
  return {
    low,
    high,
    range: high - low + 1,
    binSize
  }
}

function logPosition(freq, minLog, logRange, width) {
  return ((Math.log(freq) / Math.log(10) - minLog) / logRange) * width
}

module.exports = { binSize, getBins, logPosition }
