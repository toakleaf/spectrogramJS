class Settings {
  constructor() {
    this.REFRESH_RATE = 100
    this.MIN_FREQ = 80
    this.MAX_FREQ = 16000
    this.FFT_SIZE = 16384 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
    this.SMOOTHING = 0.0 // 0.0-1.0
    this.DISPLAY = 'Logarithmic'
    this.CANVAS_ORIGIN = { x: 0, y: 35 }
  }

  get NUM_BINS() {
    return this.FFT_SIZE / 2
  }

  get MIN_LOG() {
    return Math.log(this.MIN_FREQ) / Math.log(10)
  }

  get LOG_RANGE() {
    return Math.log(this.MAX_FREQ) / Math.log(10) - this.MIN_LOG
  }
}

module.exports = { Settings }
