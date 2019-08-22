import utils from './utils'
import { Shape } from './objects'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Audio
const actx = new AudioContext()
const analyser = actx.createAnalyser()
actx.fftSize = 256
//get mic input
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const source = actx.createMediaStreamSource(stream)
  source.connect(analyser)
})
const data = new Uint8Array(analyser.frequencyBinCount)
analyser.getByteFrequencyData(data)

// Event Listeners
canvas.addEventListener('mousemove', event => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

window.addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
  init()
})

canvas.addEventListener('click', event => {
  // by default audio context will be suspended until user interaction.
  if (actx.state === 'suspended') {
    actx.resume()
  }
})

// Implementation
let shapes
function init() {
  shapes = []

  for (let i = 0; i < 400; i++) {
    const radius = utils.randomIntFromRange(10, 50)
    const x = utils.randomIntFromRange(0 + radius, canvas.width - radius)
    const y = utils.randomIntFromRange(0 + radius, canvas.height - radius)
    shapes.push(new Shape(ctx, x, y, radius, utils.randomColor(colors)))
  }
}

// Animation Loop
let refTime = Date.now()
let elapsedTime = 0
function animate() {
  // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it, so manual track elapsed time
  requestAnimationFrame(animate)
  elapsedTime = Date.now() - refTime

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // slow down fft to only run every 200 ms
  if (elapsedTime >= 200) {
    refTime = Date.now()

    analyser.getByteFrequencyData(data)
    // console.log(data)
    data.forEach(bin => {
      // console.log(bin)
    })
  }

  // console.log(data)
  // shapes.forEach(shape => {
  //   shape.update()
  // })

  if (actx.state === 'suspended') {
    ctx.fillStyle = '#fff'
    ctx.fillText('CLICK TO BEGIN', mouse.x, mouse.y)
  }
}

init()
animate()
