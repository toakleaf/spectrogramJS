import utils from './utils'
import { Shape } from './objects'
import { processAudio } from './processAudio'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Audio
const actx = new AudioContext()
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(stream => processAudio(stream)) //get mic input
const analyser = actx.createAnalyser()

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

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
// let renderTime = Date.now()
function animate() {
  // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it, so manual track elapsed time
  requestAnimationFrame(animate)
  // let elapsedTime = Date.now() - renderTime
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  shapes.forEach(shape => {
    shape.update()
  })

  if (actx.state === 'suspended') {
    ctx.fillStyle = '#fff'
    ctx.fillText('CLICK TO BEGIN', mouse.x, mouse.y)
  }
}

init()
animate()
