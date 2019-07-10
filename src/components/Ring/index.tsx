import * as React from 'react'

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, start: number, end: number, color: string, width: number): void => {
  ctx.beginPath()
  ctx.arc(x, y, radius, start, end, false)
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.closePath()
}

const getPercent = (start: number, now: number, duration: number, easeFunc: (n: number) => number): number => {
  if (start > now) {
    return 0
  } else if (start + duration < now) {
    return 1
  } else {
    return easeFunc((now - start )/ duration)
  }
}

const duration = 1000
const startAngle = -Math.PI / 2

export default class Ring extends React.Component{
  state = {
    percent: 10,
  }
  private $el: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private raf: any
  private startTime: number

  componentDidMount() {
    this.ctx = this.$el.getContext('2d')

    this.animateTo(this.state.percent)
    // this.draw(this.state.percent)

    // drawCircle(this.ctx, 200, 200, 150, 0, Math.PI * 2, '#bbb', 25)
    // drawCircle(this.ctx, 200, 200, 150, -Math.PI / 2, Math.PI / 2, '#ffe411', 20)

    // this.ctx.clearRect(0, 0, 400, 400)

  }

  animateTo(percent: number) {
    requestAnimationFrame(this.draw.bind(this))
  }

  draw(time: number) {
    if (!this.startTime) {
      this.startTime = time
    }
    let p = getPercent(this.startTime, time, duration, x => x)
    const endAngle = percent % 100 / 100 * Math.PI * 2 + startAngle

    this.ctx.clearRect(0, 0, 400, 400)
    drawCircle(this.ctx, 200, 200, 150, 0, Math.PI * 2, '#bbb', 25)
    drawCircle(this.ctx, 200, 200, 150, startAngle, endAngle, '#ffe411', 20)
  }

  render() {
    return (
      <div style={{
        background: '#eee'
      }}>
        <canvas ref={el => this.$el = el} width="400px" height="400px" ></canvas>
      </div>
    )
  }
}