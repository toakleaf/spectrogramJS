module.exports = function(canvas, ctx, state) {
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - state.canvasOrigin.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })

  let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    active: true
  }
  let freq = state.minFreq
  let note = null
  let hoveringToggle = false

  canvas.addEventListener('mouseenter', event => {
    mouse.active = true
  })

  canvas.addEventListener('mouseleave', event => {
    mouse.active = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })

  canvas.addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    freq = state.logFreq(Math.floor(mouse.x), canvas.width).toFixed(2)
    note = state.noteName(freq)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    if (note.note) {
      ctx.fillText(
        `${note.note} : ${note.cents > 0 ? '+' : ''}${note.cents} cents`,
        Math.floor(mouse.x),
        Math.floor(mouse.y)
      )
    }
    ctx.fillText(
      `${freq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Hz`,
      Math.floor(mouse.x),
      Math.floor(mouse.y + 12)
    )

    if (
      mouse.x >= state.toggleButton.x &&
      mouse.x <= state.toggleButton.x + state.toggleButton.width &&
      mouse.y >= state.toggleButton.y + state.toggleButton.height &&
      mouse.y <= state.toggleButton.y + state.toggleButton.height * 2
    ) {
      hoveringToggle = true
      document.body.style.cursor = 'pointer'
    } else {
      hoveringToggle = false
      document.body.style.cursor = 'default'
    }
  })

  canvas.addEventListener('click', event => {
    if (hoveringToggle) {
      state.toggleAnimation()
    }
  })
}
