import utils from './utils'
import { Shape } from './objects'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
// const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.fillStyle = 'hsl(280, 100%, 10%)'
ctx.fillRect(0, 0, canvas.width, canvas.height)

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
// let shapes
// function init() {
//   shapes = []

//   for (let i = 0; i < 400; i++) {
//     const radius = utils.randomIntFromRange(10, 50)
//     const x = utils.randomIntFromRange(0 + radius, canvas.width - radius)
//     const y = utils.randomIntFromRange(0 + radius, canvas.height - radius)
//     shapes.push(new Shape(ctx, x, y, radius, utils.randomColor(colors)))
//   }
// }

// Animation Loop
let refTime = Date.now()
let elapsedTime = 0
let imageData
function animate() {
  // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it, so manual track elapsed time
  requestAnimationFrame(animate)

  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imageData, 0, 1)

  elapsedTime = Date.now() - refTime

  // slow down fft to only run every 200 ms
  if (elapsedTime >= 100) {
    refTime = Date.now()

    analyser.getByteFrequencyData(data)
    data.forEach((amplitude, i) => {
      let rat = amplitude / 255
      let hue = Math.round((rat * 120 + 280) % 360)
      let sat = '100%'
      let lit = 10 + 70 * rat
      ctx.beginPath()
      ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`
      ctx.moveTo((i * canvas.width) / data.length, 0)
      // ctx.moveTo(x, H - i * h)
      ctx.lineTo(
        canvas.width / data.length + (i * canvas.width) / data.length,
        0
      )
      // ctx.lineTo(x, H - (i * h + h))
      ctx.stroke()
    })
  } else {
    let topRow = (imageData = ctx.getImageData(0, 1, canvas.width, 2))
    ctx.putImageData(imageData, 0, 0)
  }

  // console.log(data)
  // shapes.forEach(shape => {
  //   shape.update()
  // })

  // if (actx.state === 'suspended') {
  //   ctx.fillStyle = '#fff'
  //   ctx.fillText('CLICK TO BEGIN', mouse.x, mouse.y)
  // }
}

// init()
animate()
