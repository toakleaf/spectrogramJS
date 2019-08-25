module.exports = function(canvas, ctx, state) {
  const FONT_SIZE = 12
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - state.canvasOrigin.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawToggle()
  })

  function drawToggle() {
    let text = state.paused ? 'Resume' : 'Pause'
    state.toggleButton.x = canvas.width - 70
    state.toggleButton.y = canvas.height - 20
    ctx.clearRect(
      state.toggleButton.x,
      state.toggleButton.y - FONT_SIZE,
      state.toggleButton.width,
      state.toggleButton.height
    )
    ctx.fillStyle = '#fff'
    ctx.font = `${FONT_SIZE}px sans-serif`
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

  function drawNoteGrid() {
    // console.log(state.centDiff(466.16, 440))
    console.log(state.noteName(440))
  }

  drawNoteGrid()
  drawToggle()
}
