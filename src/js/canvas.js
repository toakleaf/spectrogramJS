import * as dat from 'dat.gui'

const gui = new dat.GUI()
gui.closed = true

const SETTINGS = {
  HEADER_SIZE: 35,
  REFRESH_RATE: 100,
  MIN_FREQ: 80,
  MAX_FREQ: 16000,
  FFT_SIZE: 16384, // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
  SMOOTHING: 0.0, // 0.0-1.0
  DISPLAY: 'Logarithmic',
  get NUM_BINS() {
    return this.FFT_SIZE / 2
  },
  get MIN_LOG() {
    return Math.log(this.MIN_FREQ) / Math.log(10)
  },
  get LOG_RANGE() {
    return Math.log(this.MAX_FREQ) / Math.log(10) - this.MIN_LOG
  }
}

gui.add(SETTINGS, 'REFRESH_RATE', 15, 500)
gui.add(SETTINGS, 'MIN_FREQ', 20, 1000)
gui.add(SETTINGS, 'MAX_FREQ', 1000, 22000)
gui.add(SETTINGS, 'FFT_SIZE', [
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
gui.add(SETTINGS, 'SMOOTHING', 0.0, 1.0).step(0.05)
gui.add(SETTINGS, 'DISPLAY', ['Logarithmic', 'Linear'])

function binSize(numBins, sampleRate) {
  const maxFreq = sampleRate / 2
  return maxFreq / numBins
}

function bucketRange(min, max, numBins, binSize) {
  let low = Math.floor(min / binSize) - 1
  low = low > 0 ? low : 0
  const high = Math.floor(max / binSize) - 1
  return {
    low,
    high,
    range: high - low + 1,
    binSize
  }
}

function logPosition(freq, minLog, logRange, width) {
  return ((Math.log(freq) / Math.log(10) - minLog) / logRange) * width
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
canvas.height = window.innerHeight - SETTINGS.HEADER_SIZE

canvas.width = window.innerWidth
ctx.fillStyle = 'hsl(280, 100%, 10%)'
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Audio
const actx = new AudioContext()
const analyser = actx.createAnalyser()
analyser.fftSize = parseInt(SETTINGS.FFT_SIZE)
analyser.smoothingTimeConstant = SETTINGS.SMOOTHING
//get mic input
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const source = actx.createMediaStreamSource(stream)
  source.connect(analyser)
})
let data = new Uint8Array(analyser.frequencyBinCount)
let dataBuckets = bucketRange(
  SETTINGS.MIN_FREQ,
  SETTINGS.MAX_FREQ,
  SETTINGS.NUM_BINS,
  binSize(SETTINGS.NUM_BINS, actx.sampleRate)
)

// Event Listeners
window.addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
  ctx.fillStyle = 'hsl(280, 100%, 10%)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
})

canvas.addEventListener('click', event => {
  // by default audio context will be suspended until user interaction.
  if (actx.state === 'suspended') {
    actx.resume()
  }
})

// Animation Loop
let refMaxFreq = SETTINGS.MAX_FREQ
let refMinFreq = SETTINGS.MIN_FREQ
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

  if (
    analyser.fftSize !== parseInt(SETTINGS.FFT_SIZE) ||
    analyser.smoothingTimeConstant !== SETTINGS.SMOOTHING ||
    refMaxFreq !== SETTINGS.MAX_FREQ ||
    refMinFreq !== SETTINGS.MIN_FREQ
  ) {
    refMaxFreq = SETTINGS.MAX_FREQ
    refMinFreq = SETTINGS.MIN_FREQ
    analyser.fftSize = parseInt(SETTINGS.FFT_SIZE)
    analyser.smoothingTimeConstant = SETTINGS.SMOOTHING
    data = new Uint8Array(analyser.frequencyBinCount)
    dataBuckets = bucketRange(
      SETTINGS.MIN_FREQ,
      SETTINGS.MAX_FREQ,
      SETTINGS.NUM_BINS,
      binSize(SETTINGS.NUM_BINS, actx.sampleRate)
    )
  }

  elapsedTime = Date.now() - refTime
  // slow down fft to only run every 200 ms
  if (elapsedTime >= SETTINGS.REFRESH_RATE) {
    refTime = Date.now()

    analyser.getByteFrequencyData(data)

    let prevLogPos = 0

    if (SETTINGS.DISPLAY === 'Logarithmic') {
      for (let i = dataBuckets.low; i <= dataBuckets.high; i++) {
        // console.log(prevLogPos)
        let rat = data[i] / 255
        let hue = Math.round((rat * 120 + 280) % 360)
        let sat = '100%'
        let lit = 10 + 70 * rat
        ctx.beginPath()
        ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`
        ctx.moveTo(prevLogPos, 0)
        prevLogPos = logPosition(
          i * dataBuckets.binSize,
          SETTINGS.MIN_LOG,
          SETTINGS.LOG_RANGE,
          canvas.width
        )
        ctx.lineTo(prevLogPos, 0)
        ctx.stroke()
        ctx.closePath()
      }
    } else {
      // linear
      for (let i = dataBuckets.low; i <= dataBuckets.high; i++) {
        let rat = data[i] / 255
        let hue = Math.round((rat * 120 + 280) % 360)
        let sat = '100%'
        let lit = 10 + 70 * rat
        ctx.beginPath()
        ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`
        ctx.moveTo((i * canvas.width) / dataBuckets.range, 0)
        ctx.lineTo(
          canvas.width / dataBuckets.range +
            (i * canvas.width) / dataBuckets.range,
          0
        )
        ctx.stroke()
        ctx.closePath()
      }
    }
  } else {
    let topRow = (imageData = ctx.getImageData(0, 1, canvas.width, 2))
    ctx.putImageData(imageData, 0, 0)
  }
}

animate()
