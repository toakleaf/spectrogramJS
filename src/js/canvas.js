import spectrograph from './spectrograph.js'
import foreground from './foreground.js'
import { Settings } from './settings.js'

const HEADER_SIZE = 35
const start = document.querySelector('#start')

// Audio Context is requires user input to enable so browsers don't block as spam
start.addEventListener('click', event => {
  start.style.display = 'none'

  // Instantiate Settings
  let settings = new Settings()

  // Spectrograph Canvas setup
  const spectrographCanvas = document.querySelector('canvas#spectrograph')
  const ctx = spectrographCanvas.getContext('2d')
  spectrographCanvas.height = window.innerHeight - HEADER_SIZE
  spectrographCanvas.width = window.innerWidth
  ctx.fillStyle = 'hsl(280, 100%, 10%)'
  ctx.fillRect(0, 0, spectrographCanvas.width, spectrographCanvas.height)

  window.addEventListener('resize', () => {
    spectrographCanvas.width = innerWidth
    spectrographCanvas.height = innerHeight
    ctx.fillStyle = 'hsl(280, 100%, 10%)'
    ctx.fillRect(0, 0, spectrographCanvas.width, spectrographCanvas.height)
  })

  spectrograph(spectrographCanvas, ctx, settings)
})
