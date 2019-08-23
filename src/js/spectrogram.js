import gui from './gui.js'
import { binSize, getBins, logPosition } from './audioUtils.js'
import settings from './settings.js'

module.exports = function(canvas, ctx) {
  // GUI Setup
  gui(settings)

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
  let dataBinRef
  function init() {
    analyser.fftSize = parseInt(settings.FFT_SIZE)
    analyser.smoothingTimeConstant = settings.SMOOTHING
    data = new Uint8Array(analyser.frequencyBinCount)
    dataBinRef = getBins(
      settings.MIN_FREQ,
      settings.MAX_FREQ,
      settings.NUM_BINS,
      binSize(settings.NUM_BINS, actx.sampleRate)
    )
  }
  init()

  // Reference state outside of animation loop
  let refMaxFreq = settings.MAX_FREQ
  let refMinFreq = settings.MIN_FREQ
  let refTime = Date.now()
  let elapsedTime = 0
  let imageData

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate)

    // To animate downward movement, save all but bottom pixel row, clear, and redraw down one pixel
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(imageData, 0, 1)

    // Reset audio fields when user changes settings.
    if (
      analyser.fftSize !== parseInt(settings.FFT_SIZE) ||
      analyser.smoothingTimeConstant !== settings.SMOOTHING ||
      refMaxFreq !== settings.MAX_FREQ ||
      refMinFreq !== settings.MIN_FREQ
    ) {
      refMaxFreq = settings.MAX_FREQ
      refMinFreq = settings.MIN_FREQ
      init()
    }

    // Slow down fft refresh rate from default 15-18 ms
    // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it
    elapsedTime = Date.now() - refTime
    if (elapsedTime >= settings.REFRESH_RATE) {
      refTime = Date.now()

      // Fill up the data array
      analyser.getByteFrequencyData(data)

      let prevLogPos = 0

      // Draw data points on canvas
      for (let i = dataBinRef.low; i <= dataBinRef.high; i++) {
        let rat = data[i] / 255
        let hue = Math.round((rat * 120 + 280) % 360)
        let sat = '100%'
        let lit = 10 + 70 * rat

        ctx.beginPath()
        ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`

        // Logarithmic Display
        if (settings.DISPLAY === 'Logarithmic') {
          ctx.moveTo(prevLogPos, 0)
          prevLogPos = logPosition(
            i * dataBinRef.binSize,
            settings.MIN_LOG,
            settings.LOG_RANGE,
            canvas.width
          )
          ctx.lineTo(prevLogPos, 0)
        }
        // Linear Display
        else {
          ctx.moveTo((i * canvas.width) / dataBinRef.range, 0)
          ctx.lineTo(
            canvas.width / dataBinRef.range +
              (i * canvas.width) / dataBinRef.range,
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

  animate()
}
