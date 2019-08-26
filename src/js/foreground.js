module.exports = function(canvas, ctx, state) {
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - state.canvasOrigin.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawNoteGrid()
    drawToggle()
  })

  function drawToggle() {
    let text = state.paused ? 'Resume' : 'Pause'
    state.toggleButton.x = canvas.width - 70
    state.toggleButton.y = canvas.height - 20
    ctx.clearRect(
      state.toggleButton.x,
      state.toggleButton.y - state.fontSize,
      state.toggleButton.width,
      state.toggleButton.height
    )
    ctx.fillStyle = '#fff'
    ctx.font = `${state.fontSize}px sans-serif`
    ctx.fillText(text, state.toggleButton.x, state.toggleButton.y)
  }

  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 32 || e.keyCode === 75) {
      state.toggleAnimation()
    }
  })

  document.addEventListener('toggleAnimation', function(e) {
    drawToggle()
  })

  document.addEventListener('refresh', function(e) {
    drawNoteGrid()
    drawToggle()
  })

  function drawNoteGrid() {
    let x
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (state.display !== 'Logarithmic' || !state.noteGrid) {
      state.noteGrid = false
      return
    }
    state.notes[state.refPitch].forEach(note => {
      if (note.frequency > state.minFreq && note.frequency < state.maxFreq) {
        x = state.logPositionX(note.frequency, canvas.width)
        ctx.beginPath()
        if (note.note[1] === '#') {
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.08)'
        } else if (note.note[0] === 'C') {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
        }
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
        ctx.closePath()
      }
    })
  }

  drawNoteGrid()
  drawToggle()
}
