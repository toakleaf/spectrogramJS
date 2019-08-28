module.exports = function(canvas, ctx, store) {
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - store.canvasOrigin.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawNoteGrid()
    drawToggle()
  })

  function drawToggle() {
    let text = store.paused ? 'Resume' : 'Pause'
    store.toggleButton.x = canvas.width - 70
    store.toggleButton.y = canvas.height - 20
    ctx.clearRect(
      store.toggleButton.x,
      store.toggleButton.y - store.fontSize,
      store.toggleButton.width,
      store.toggleButton.height
    )
    ctx.fillStyle = '#fff'
    ctx.font = `${store.fontSize}px sans-serif`
    ctx.fillText(text, store.toggleButton.x, store.toggleButton.y)
  }

  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 32 || e.keyCode === 75) {
      store.toggleAnimation()
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
    if (store.display !== 'Logarithmic' || !store.noteGrid) {
      store.noteGrid = false
      return
    }
    store.notes[store.refPitch].forEach(note => {
      if (note.frequency > store.minFreq && note.frequency < store.maxFreq) {
        x = store.logPositionX(note.frequency, canvas.width)
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
