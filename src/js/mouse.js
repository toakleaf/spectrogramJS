module.exports = function(canvas, ctx, store) {
  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - store.canvasOrigin.y
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })

  let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    active: true
  }
  let freq = store.minFreq
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
    if (
      mouse.x >= store.toggleButton.x &&
      mouse.x <= store.toggleButton.x + store.toggleButton.width &&
      mouse.y >= store.toggleButton.y + store.toggleButton.height &&
      mouse.y <= store.toggleButton.y + store.toggleButton.height * 2
    ) {
      hoveringToggle = true
      document.body.style.cursor = 'pointer'
    } else {
      hoveringToggle = false
      document.body.style.cursor = 'default'
    }
    if (store.display !== 'Logarithmic' || !store.pointerNotes) {
      store.pointerNotes = false
      return
    }
    freq = store.logFreq(Math.floor(mouse.x), canvas.width).toFixed(2)
    note = store.noteName(freq)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    ctx.font = `${store.fontSize}px sans-serif`
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
      Math.floor(mouse.y + store.fontSize + 1)
    )
  })

  canvas.addEventListener('click', event => {
    if (hoveringToggle) {
      store.toggleAnimation()
    }
  })
}
