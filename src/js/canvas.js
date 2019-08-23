import spectrogram from './spectrogram.js'

const HEADER_SIZE = 35
const start = document.querySelector('#start')

// Audio Context is requires user input to enable so browsers don't block as spam
start.addEventListener('click', event => {
  start.style.display = 'none'

  // Canvas setup
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  canvas.height = window.innerHeight - HEADER_SIZE
  canvas.width = window.innerWidth
  ctx.fillStyle = 'hsl(280, 100%, 10%)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    ctx.fillStyle = 'hsl(280, 100%, 10%)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  })

  spectrogram(canvas, ctx)
})
