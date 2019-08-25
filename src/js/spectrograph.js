import { binSize, getBinInfo } from './audioUtils.js'

module.exports = function(canvas, ctx, state) {
  // Clear canvases on resize
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - state.canvasOrigin.y
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
    analyser.fftSize = parseInt(state.fftSize)
    analyser.smoothingTimeConstant = state.smoothing
    data = new Uint8Array(analyser.frequencyBinCount)
    dataBinInfo = getBinInfo(
      state.minFreq,
      state.maxFreq,
      state.numBins,
      binSize(state.numBins, actx.sampleRate)
    )
  }
  init()

  // Local state for reference outside animation loop
  let refMaxFreq = state.maxFreq
  let refMinFreq = state.minFreq
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

    // Reset audio fields when user changes state.
    if (
      analyser.fftSize !== parseInt(state.fftSize) ||
      analyser.smoothingTimeConstant !== state.smoothing ||
      refMaxFreq !== state.maxFreq ||
      refMinFreq !== state.minFreq
    ) {
      refMaxFreq = state.maxFreq
      refMinFreq = state.minFreq
      init()
    }

    // Slow down fft refresh rate from default 15-18 ms
    // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it
    elapsedTime = Date.now() - refTime
    if (elapsedTime >= state.refreshRate) {
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
        if (state.display === 'Logarithmic') {
          ctx.moveTo(prevLogPos, 0)
          prevLogPos = state.logPositionX(i * dataBinInfo.binSize, canvas.width)
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

  // Listen for custom toggleAnimation event declared in state.js
  document.addEventListener('toggleAnimation', function(e) {
    if (state.paused) {
      stop()
    } else {
      start()
    }
  })

  animate()
}
