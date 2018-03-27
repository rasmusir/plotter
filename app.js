if (typeof(window) === "undefined") throw new Error("Must be run in a browser")
window.addEventListener("load", () => {
    App.main()
})

class App {
    static main() {
        this.canvas = document.querySelector("canvas")
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.scale = 0.1
        this.x = -this.canvas.width * this.scale / 2
        this.y = -this.canvas.height * this.scale / 2
        this.context = this.canvas.getContext("2d")

        this.setScrollBehaviour()
        this.setResizeBehaviour()
        this.setPanBehaviour()
        this.triggerRedraw()
    }

    static draw() {
        this.context.strokeStyle = "red"
        this.plotFunction( x => Math.sin(x) + Math.sin(x / 10) * 10)

        this.context.strokeStyle = "blue"
        this.plotFunction(Math.cos)

        this.context.fillStyle = "green"
        this.plotPoint([3, 5])

        this.context.fillStyle = "yellow"
        const points = [
            1,4,
            2,5,
            3,6,
            4,7,
            5,8,
            6,9,
            6,10,
            6,11,
            6,12,
            6,13,
            6,14,
            6,15,
            6,16
        ]
        this.plotPoints(points)
        this.plotCorrelationLine(points)
    }

    static setScrollBehaviour() {
        this.canvas.addEventListener("mousewheel", e => {
            var targetXPreScale = e.clientX * this.scale
            var targetYPreScale = e.clientY * this.scale
            this.scale -= (e.wheelDelta / 500) * this.scale * 0.2
            this.x -= e.clientX * this.scale - targetXPreScale
            this.y -= e.clientY * this.scale - targetYPreScale
            this.triggerRedraw()
            e.preventDefault()
        })
    }

    static setPanBehaviour() {
        var isGrabbing = false
        var lastPos = {x:0, y:0};
        this.canvas.addEventListener("mousedown", e => {
            isGrabbing = true
            lastPos.x = e.clientX
            lastPos.y = e.clientY
            e.preventDefault()
        })

        this.canvas.addEventListener("mousemove", e => {
            if (isGrabbing) {
                this.x -= (e.clientX - lastPos.x) * this.scale
                this.y -= (e.clientY - lastPos.y) * this.scale

                lastPos.x = e.clientX
                lastPos.y = e.clientY
                this.triggerRedraw()
            }
        })

        window.addEventListener("mouseup", e => isGrabbing = false)
    }

    static setResizeBehaviour() {
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.triggerRedraw()
        })
    }

    static triggerRedraw() {
        window.requestAnimationFrame(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.draw()
        })
    }

    static plotFunction(func) {
        var x = this.x
        this.context.moveTo(0, -(func(x) + this.y))
        this.context.beginPath()
        for (var n = 0; n < this.canvas.width; n++) {
            x = n * this.scale + this.x
            this.context.lineTo(n, -(func(x) + this.y) / this.scale)
        }
        this.context.stroke()
    }

    static plotCorrelationLine(points) {
        var sorted = []

        for (var n = 0; n < points.length; n += 2) {
            sorted[n/2] = [points[n], points[n + 1]]
        }
        sorted = sorted.sort((a, b) => a[0] - b[0])

        const averagePoint = sorted.reduce((total, point) => {
            total[0] += point[0]
            total[1] += point[1]
            return total
        }, [0, 0])
        averagePoint[0] /= sorted.length
        averagePoint[1] /= sorted.length
        var averageM = 0

        for (var n = 1; n < sorted.length; n++) {
            const deltaX = sorted[n - 1][0] - sorted[n][0]
            const deltaY = sorted[n - 1][1] - sorted[n][1]
            averageM += deltaY / Math.max(1, deltaX)
        }
        averageM /= (sorted.length - 1)

        this.plotFunction(x => averageM * x - averagePoint[0])
    }

    static plotPoints(points) {
        for (var n = 0; n < points.length; n += 2) {
            this.plotPoint([points[n], points[n + 1]])
        }
    }

    static plotPoint(point) {
        point = this.transform(point)
        this.context.fillRect(point[0] - 1, point[1] - 1, 3, 3)
    }

    static transform(point) {
        return [
            (point[0] - this.x) / this.scale,
            (point[1] - this.y) / this.scale
        ]
    }
}