module.exports = function(canvas, ctx, settings) {
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

  canvas.addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY - settings.CANVAS_ORIGIN.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    ctx.fillText(`(${mouse.x},${mouse.y})`, mouse.x, mouse.y + 30)
  })
}
