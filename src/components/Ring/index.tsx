import * as React from 'react'
import { number } from 'prop-types';

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, start: number, end: number, color: string, width: number): void => {
  ctx.beginPath()
  ctx.arc(x, y, radius, start, end, false)
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.closePath()
}

const animete = ({ duration, draw, easing}) => {
  let start
  let resolve
  let reject
  let afId

  const result = {
    cancel() {
      afId && cancelAnimationFrame(afId)
      reject && reject()
    },
    cbPromise: new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
  }

  const calculateStep = (time) => {
    let percent
    if (!start) {
      start = time
      percent = 0
    } else if (time - start >= duration) {
      percent = 1
    } else {
      percent = Math.max(0, easing((time - start) / duration))
    }

    if (percent >= 1) {
      draw(1)
      resolve()
    } else {
      draw(percent)
      afId = requestAnimationFrame(calculateStep)
    }
  }

  afId = requestAnimationFrame(calculateStep)
  
  return result
}

// const duration = 1000
const startAngle = -Math.PI / 2

export default class Ring extends React.Component{
  state = {
    percent: 0.1,
  }
  private $el: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private raf: any
  private startTime: number
  private animateResult: any

  componentDidMount() {
    this.ctx = this.$el.getContext('2d')
    
    animete({
      duration: 3000,
      easing: x => x,
      draw: this.drawWrap(0, this.state.percent, this.ctx),
    })
    
    // TODO 1. cancel prev animation, 2. use currentPercent and percent

    // this.animateResult = animete({
    //   duration: 3000,
    //   easing: x => x,
    //   draw: this.drawWrap(this.state.percent, 0.9, this.ctx),
    // })

  }

  stop() {
    // debugger
    this.animateResult.cancel()
  }
  add() {
    // debugger
    animete({
      duration: 500,
      easing: x => x,
      draw: this.drawWrap(this.state.percent, this.state.percent + 0.1, this.ctx),
    })

  }

  drawWrap(from, to, ctx) {
    return (p) => {
      const currPercent = (to - from) * p + from
      const end =  startAngle + Math.PI * 2 * currPercent
      this.setState({
        percent: currPercent
      })
  
      ctx.clearRect(0, 0, 400, 400)
      drawCircle(ctx, 200, 200, 150, 0, Math.PI * 2, '#bbb', 25)
      drawCircle(ctx, 200, 200, 150, startAngle, end, '#ffe411', 20)
    }
  }

  render() {
    return (
      <div style={{
        background: '#eee'
      }}>
        <button onTouchStart={this.stop.bind(this)}>Stop!</button>
        <button onTouchStart={this.add.bind(this)}>add10!</button>
        <canvas ref={el => this.$el = el} width="400px" height="400px" ></canvas>
      </div>
    )
  }
}