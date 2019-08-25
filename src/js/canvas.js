import spectrogram from './spectrogram.js'

const HEADER_SIZE = 35
const start = document.querySelector('#start')

// Audio Context is requires user input to enable so browsers don't block as spam
start.addEventListener('click', event => {
  start.style.display = 'none'

  // Canvas setup
  const spectrogramCanvas = document.querySelector('canvas#spectrogram')
  const ctx = spectrogramCanvas.getContext('2d')
  spectrogramCanvas.height = window.innerHeight - HEADER_SIZE
  spectrogramCanvas.width = window.innerWidth
  ctx.fillStyle = 'hsl(280, 100%, 10%)'
  ctx.fillRect(0, 0, spectrogramCanvas.width, spectrogramCanvas.height)

  window.addEventListener('resize', () => {
    spectrogramCanvas.width = innerWidth
    spectrogramCanvas.height = innerHeight
    ctx.fillStyle = 'hsl(280, 100%, 10%)'
    ctx.fillRect(0, 0, spectrogramCanvas.width, spectrogramCanvas.height)
  })

  spectrogram(spectrogramCanvas, ctx)
})
