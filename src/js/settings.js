module.exports = {
  REFRESH_RATE: 100,
  MIN_FREQ: 80,
  MAX_FREQ: 16000,
  FFT_SIZE: 16384, // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
  SMOOTHING: 0.0, // 0.0-1.0
  DISPLAY: 'Logarithmic',
  get NUM_BINS() {
    return this.FFT_SIZE / 2
  },
  get MIN_LOG() {
    return Math.log(this.MIN_FREQ) / Math.log(10)
  },
  get LOG_RANGE() {
    return Math.log(this.MAX_FREQ) / Math.log(10) - this.MIN_LOG
  }
}
