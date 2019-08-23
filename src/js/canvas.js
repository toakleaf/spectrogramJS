const REFRESH_RATE = 100
const MIN_FREQ = 80
const MAX_FREQ = 16000
const FFT_SIZE = 16384 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
const SMOOTHING = 0.1 // 0-1
const NUM_BINS = FFT_SIZE / 2
const MIN_LOG = Math.log(MIN_FREQ) / Math.log(10)
const MAX_LOG = Math.log(MAX_FREQ) / Math.log(10)
const LOG_RANGE = MAX_LOG - MIN_LOG

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

canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.fillStyle = 'hsl(280, 100%, 10%)'
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Audio
const actx = new AudioContext()
const analyser = actx.createAnalyser()
analyser.fftSize = FFT_SIZE
analyser.smoothingTimeConstant = SMOOTHING

//get mic input
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const source = actx.createMediaStreamSource(stream)
  source.connect(analyser)
})
const data = new Uint8Array(analyser.frequencyBinCount)
analyser.getByteFrequencyData(data)
const dataBuckets = bucketRange(
  MIN_FREQ,
  MAX_FREQ,
  NUM_BINS,
  binSize(NUM_BINS, actx.sampleRate)
)

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

// Animation Loop
let refTime = Date.now()
let elapsedTime = 0
let imageData
function animate() {
  // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it, so manual track elapsed time
  requestAnimationFrame(animate)

  // if (actx.state === 'suspended') {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height)
  //   ctx.fillStyle = '#fff'
  //   ctx.fillText('CLICK TO BEGIN', mouse.x, mouse.y)
  // }

  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imageData, 0, 1)

  elapsedTime = Date.now() - refTime

  // slow down fft to only run every 200 ms
  if (elapsedTime >= REFRESH_RATE) {
    refTime = Date.now()

    analyser.getByteFrequencyData(data)

    let prevLogPos = 0
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
        MIN_LOG,
        LOG_RANGE,
        canvas.width
      )
      ctx.lineTo(prevLogPos, 0)
      ctx.stroke()
      ctx.closePath()
    }

    // // linear
    // for (let i = dataBuckets.low; i <= dataBuckets.high; i++) {
    //   let rat = data[i] / 255
    //   let hue = Math.round((rat * 120 + 280) % 360)
    //   let sat = '100%'
    //   let lit = 10 + 70 * rat
    //   ctx.beginPath()
    //   ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`
    //   ctx.moveTo((i * canvas.width) / dataBuckets.range, 0)
    //   // ctx.moveTo(x, H - i * h)
    //   ctx.lineTo(
    //     canvas.width / dataBuckets.range +
    //       (i * canvas.width) / dataBuckets.range,
    //     0
    //   )
    //   // ctx.lineTo(x, H - (i * h + h))
    //   ctx.stroke()
    //   ctx.closePath()
    // }
  } else {
    let topRow = (imageData = ctx.getImageData(0, 1, canvas.width, 2))
    ctx.putImageData(imageData, 0, 0)
  }
}

animate()
