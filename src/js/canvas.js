import spectrogram from './spectrogram.js'
import foreground from './foreground.js'
import mouse from './mouse.js'
import Store from './Store.js'
import gui from './gui.js'

const start = document.querySelector('#start')

// Audio Context is requires user input to enable so browsers don't block as spam
start.addEventListener('click', event => {
  start.style.display = 'none'

  // Instantiate Store
  let store = new Store()

  // GUI Setup
  gui(store)

  // Spectrogram Canvas setup
  const spectrogramCanvas = document.querySelector('canvas#spectrogram')
  const spectrogramCTX = spectrogramCanvas.getContext('2d')
  spectrogramCanvas.height = window.innerHeight - store.canvasOrigin.y
  spectrogramCanvas.width = window.innerWidth
  spectrogramCTX.fillStyle = 'hsl(280, 100%, 10%)'
  spectrogramCTX.fillRect(
    0,
    0,
    spectrogramCanvas.width,
    spectrogramCanvas.height
  )

  // Foreground Canvas setup
  const foregroundCanvas = document.querySelector('canvas#foreground')
  const foregroundCTX = foregroundCanvas.getContext('2d')
  foregroundCanvas.height = window.innerHeight - store.canvasOrigin.y
  foregroundCanvas.width = window.innerWidth

  // Mouse Canvas setup
  const mouseCanvas = document.querySelector('canvas#mouse')
  const mouseCTX = mouseCanvas.getContext('2d')
  mouseCanvas.height = window.innerHeight - store.canvasOrigin.y
  mouseCanvas.width = window.innerWidth

  spectrogram(spectrogramCanvas, spectrogramCTX, store)
  foreground(foregroundCanvas, foregroundCTX, store)
  mouse(mouseCanvas, mouseCTX, store)
})
