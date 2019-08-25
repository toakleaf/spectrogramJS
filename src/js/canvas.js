import spectrograph from './spectrograph.js'
import foreground from './foreground.js'
import { Settings } from './settings.js'
import gui from './gui.js'

const start = document.querySelector('#start')

// Audio Context is requires user input to enable so browsers don't block as spam
start.addEventListener('click', event => {
  start.style.display = 'none'

  // Instantiate Settings
  let settings = new Settings()

  // GUI Setup
  gui(settings)

  // Spectrograph Canvas setup
  const spectrographCanvas = document.querySelector('canvas#spectrograph')
  const spectrogramCTX = spectrographCanvas.getContext('2d')
  spectrographCanvas.height = window.innerHeight - settings.CANVAS_ORIGIN.y
  spectrographCanvas.width = window.innerWidth
  spectrogramCTX.fillStyle = 'hsl(280, 100%, 10%)'
  spectrogramCTX.fillRect(
    0,
    0,
    spectrographCanvas.width,
    spectrographCanvas.height
  )

  // Foreground Canvas setup
  const foregroundCanvas = document.querySelector('canvas#foreground')
  const foregroundCTX = foregroundCanvas.getContext('2d')
  foregroundCanvas.height = window.innerHeight - settings.CANVAS_ORIGIN.y
  foregroundCanvas.width = window.innerWidth

  // Clear canvases on resize
  window.addEventListener('resize', () => {
    spectrographCanvas.width = innerWidth
    spectrographCanvas.height = innerHeight
    foregroundCanvas.width = innerWidth
    foregroundCanvas.height = innerHeight
    spectrogramCTX.fillStyle = 'hsl(280, 100%, 10%)'
    spectrogramCTX.fillRect(
      0,
      0,
      spectrographCanvas.width,
      spectrographCanvas.height
    )
  })

  spectrograph(spectrographCanvas, spectrogramCTX, settings)
  foreground(foregroundCanvas, foregroundCTX, settings)
})
