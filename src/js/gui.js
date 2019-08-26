import * as dat from 'dat.gui'

export default function(state) {
  const gui = new dat.GUI()
  gui.closed = true
  gui.add(state, 'refreshRate', 15, 500).name('Refresh Rate')
  gui.add(state, 'minFreq', 20, 1000).name('Min Frequency')
  gui.add(state, 'maxFreq', 1000, 22000).name('Max Frequency')
  gui
    .add(state, 'fftSize', [
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
    .name('FFT Size')
  gui
    .add(state, 'smoothing', 0.0, 1.0)
    .step(0.05)
    .name('FFT Smoothing')
  gui.add(state, 'display', ['Logarithmic', 'Linear']).name('Display Type')
  gui.add(state, 'noteGrid').name('Show Note Grid')
}
