import * as dat from 'dat.gui'

export default function(store) {
  const gui = new dat.GUI()
  gui.closed = true
  gui.add(store, 'windowLength', 15, 500).name('Window Length')
  gui.add(store, 'minFreq', 20, 1000).name('Min Frequency')
  gui.add(store, 'maxFreq', 1000, 22000).name('Max Frequency')
  gui
    .add(store, 'fftSize', [
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
    .add(store, 'smoothing', 0.0, 1.0)
    .step(0.05)
    .name('FFT Smoothing')
  gui.add(store, 'display', ['Logarithmic', 'Linear']).name('Display Type')
  gui
    .add(store, 'noteGrid')
    .name('Show Note Grid')
    .listen()
  gui
    .add(store, 'pointerNotes')
    .name('Show Pointer Notes')
    .listen()
  gui
    .add(store, 'refPitch', [
      '432',
      '434',
      '436',
      '438',
      '440',
      '442',
      '444',
      '446'
    ])
    .name('Reference Pitch')
}
