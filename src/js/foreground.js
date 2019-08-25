module.exports = function(canvas, ctx, state) {
  let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    active: true
  }

  canvas.addEventListener('mouseenter', event => {
    mouse.active = true
  })

  canvas.addEventListener('mouseleave', event => {
    mouse.active = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })

  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 32 || e.keyCode === 75) {
      state.paused = !state.paused
    }
  })

  canvas.addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY - state.canvasOrigin.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    ctx.fillText(
      `${state
        .logFreq(Math.floor(mouse.x), canvas.width)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Hz`,
      Math.floor(mouse.x),
      Math.floor(mouse.y + 30)
    )
  })
}
