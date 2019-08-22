class Shape {
    constructor(context, x, y, radius, color) {
        this.ctx = context
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
        this.ctx.closePath()
    }

    update() {
        this.draw()
    }
}

module.exports = { Shape }
