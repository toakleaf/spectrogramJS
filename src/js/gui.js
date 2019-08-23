import * as dat from 'dat.gui'

module.exports = function(SETTINGS) {
  const gui = new dat.GUI()
  gui.closed = true
  gui.add(SETTINGS, 'REFRESH_RATE', 15, 500)
  gui.add(SETTINGS, 'MIN_FREQ', 20, 1000)
  gui.add(SETTINGS, 'MAX_FREQ', 1000, 22000)
  gui.add(SETTINGS, 'FFT_SIZE', [
    32,
    64,
    128,
    256,
    512,
    1024,
    2048,
    4096,
    8192,
    16384,
    32768
  ])
  gui.add(SETTINGS, 'SMOOTHING', 0.0, 1.0).step(0.05)
  gui.add(SETTINGS, 'DISPLAY', ['Logarithmic', 'Linear'])
}
