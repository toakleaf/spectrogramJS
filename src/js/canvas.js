import spectrograph from './spectrograph.js'
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

  // Spectrograph Canvas setup
  const spectrographCanvas = document.querySelector('canvas#spectrograph')
  const spectrographCTX = spectrographCanvas.getContext('2d')
  spectrographCanvas.height = window.innerHeight - store.canvasOrigin.y
  spectrographCanvas.width = window.innerWidth
  spectrographCTX.fillStyle = 'hsl(280, 100%, 10%)'
  spectrographCTX.fillRect(
    0,
    0,
    spectrographCanvas.width,
    spectrographCanvas.height
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

  spectrograph(spectrographCanvas, spectrographCTX, store)
  foreground(foregroundCanvas, foregroundCTX, store)
  mouse(mouseCanvas, mouseCTX, store)
})
