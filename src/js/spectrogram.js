import { binSize, getBinInfo } from './audioUtils.js'

export default function(canvas, ctx, store) {
  // Clear canvases on resize
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - store.canvasOrigin.y
    ctx.fillStyle = 'hsl(280, 100%, 10%)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  })

  // Audio Setup
  const ContextConstructor = window.AudioContext || window.webkitAudioContext
  const actx = new ContextConstructor()
  const analyser = actx.createAnalyser()

  // Get mic input
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const source = actx.createMediaStreamSource(stream)
    source.connect(analyser)
  })

  // Initialize data array
  let data
  let dataBinInfo
  function init() {
    analyser.fftSize = parseInt(store.fftSize)
    analyser.smoothingTimeConstant = store.smoothing
    data = new Uint8Array(analyser.frequencyBinCount)
    dataBinInfo = getBinInfo(
      store.minFreq,
      store.maxFreq,
      store.numBins,
      binSize(store.numBins, actx.sampleRate)
    )
  }
  init()

  // Local store for reference outside animation loop
  let refMaxFreq = store.maxFreq
  let refMinFreq = store.minFreq
  let refDisplay = store.display
  let refNoteGrid = store.noteGrid
  let refPitch = store.refPitch
  let refTime = Date.now()
  let elapsedTime = 0
  let imageData
  let requestId

  // Animation Loop
  function animate() {
    requestId = undefined
    start()

    // To animate downward movement, save all but bottom pixel row, clear, and redraw down one pixel
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(imageData, 0, 1)

    // Reset audio fields when user changes store.
    if (
      analyser.fftSize !== parseInt(store.fftSize) ||
      analyser.smoothingTimeConstant !== store.smoothing ||
      refMaxFreq !== store.maxFreq ||
      refMinFreq !== store.minFreq ||
      refDisplay !== store.display ||
      refNoteGrid !== store.noteGrid ||
      refPitch !== store.refPitch
    ) {
      refMaxFreq = store.maxFreq
      refMinFreq = store.minFreq
      refDisplay = store.display
      refNoteGrid = store.noteGrid
      refPitch = store.refPitch
      document.dispatchEvent(store.refreshEvent)
      init()
    }

    // Slow down fft refresh rate from default 15-18 ms
    // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it
    elapsedTime = Date.now() - refTime
    if (elapsedTime >= store.windowLength) {
      refTime = Date.now()

      // Fill up the data array
      analyser.getByteFrequencyData(data)

      let prevLogPos = 0

      // Draw data points on canvas
      for (let i = dataBinInfo.low; i <= dataBinInfo.high; i++) {
        let rat = data[i] / 255
        let hue = Math.round((rat * 120 + 280) % 360)
        let sat = '100%'
        let lit = 10 + 70 * rat

        ctx.beginPath()
        ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`

        // Logarithmic Display
        if (store.display === 'Logarithmic') {
          ctx.moveTo(prevLogPos, 0)
          prevLogPos = store.logPositionX(i * dataBinInfo.binSize, canvas.width)
          ctx.lineTo(prevLogPos, 0)
        }
        // Linear Display
        else {
          ctx.moveTo((i * canvas.width) / dataBinInfo.range, 0)
          ctx.lineTo(
            canvas.width / dataBinInfo.range +
              (i * canvas.width) / dataBinInfo.range,
            0
          )
        }

        ctx.stroke()
        ctx.closePath()
      }
    } else {
      // If refresh is faster than needed, just copy 2nd row the top to repeat previous frame
      imageData = ctx.getImageData(0, 1, canvas.width, 2)
      ctx.putImageData(imageData, 0, 0)
    }
  }

  function start() {
    if (!requestId) {
      requestId = window.requestAnimationFrame(animate)
    }
  }

  function stop() {
    if (requestId) {
      window.cancelAnimationFrame(requestId)
      requestId = undefined
    }
  }

  // Listen for custom toggleAnimation event declared in store.js
  document.addEventListener('toggleAnimation', function(e) {
    if (store.paused) {
      stop()
    } else {
      start()
    }
  })

  animate()
}
