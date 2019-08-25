class State {
  constructor() {
    this.refreshRate = 100
    this.minFreq = 80
    this.maxFreq = 16000
    this.fftSize = 16384 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
    this.smoothing = 0.0 // 0.0-1.0
    this.display = 'Logarithmic'
    this.canvasOrigin = { x: 0, y: 35 }
    this.paused = false
  }

  get numBins() {
    return this.fftSize / 2
  }

  get minLog() {
    return Math.log(this.minFreq) / Math.LN10
  }

  get logRange() {
    return Math.log(this.maxFreq) / Math.LN10 - this.minLog
  }

  logPositionX(freq, width) {
    return Math.floor(
      ((Math.log(freq) / Math.LN10 - this.minLog) / this.logRange) * width
    )
  }

  logFreq(pos, width) {
    return Math.pow(
      Math.E,
      Math.LN10 * (this.minLog + (pos * this.logRange) / width)
    )
  }
}

module.exports = { State }
