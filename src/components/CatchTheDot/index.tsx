// Has to use require to use css modules with typescript
// See: https://medium.com/@sapegin/css-modules-with-typescript-and-webpack-6b221ebe5f10
const style = require('./style1.styl')

import * as React from 'react'
import { fromEvent, interval } from 'rxjs'
import { tap, map, scan, switchMap } from 'rxjs/operators'

type State = {
  interval: number
  score: number
}

const random = () => Math.random() * 300


export default class CatchTheDoc extends React.Component{
  public $dot: HTMLDivElement
  public $timer: HTMLDivElement

  state: State = {
    score: 0,
    interval: 500
  }

  setElementText(ele: HTMLElement, text: string | number) {
    ele.innerText = text.toString()
  }

  setDotSize(size: number) {
    this.$dot.style.height = `${size}px`
    this.$dot.style.width = `${size}px`
  }

  updateDot(score: number) {
    if (score % 3 === 0) {
      this.$dot.style.backgroundColor = '#' + (Math.random() * 0xffffff << 0).toString(16)
    }
    this.setElementText(this.$dot, score)
  }

  setTimerText(text: string | number) {
    this.setElementText(this.$timer, text)
  }

  moveDot() {
    this.setDotSize(5)
    this.$dot.style.transform = `translate(${random()}px, ${random()}px)`
  }

  resetDotSize() {
    this.setDotSize(30)
  }

  makeInterval(val: State) {
    return interval(val.interval).pipe(
    map(i => 5 - i),
    tap(this.setTimerText)
  )}

  componentDidMount() {
    const game$ = fromEvent(this.$dot, 'mouseover')
      .pipe(
        tap(this.moveDot),
        scan<Event, State>((acc: State) => ({
          score: acc.score + 1,
          interval: acc.score % 3 === 0 ? acc.interval - 50 : acc.interval
        }), this.state),
        tap(state => this.updateDot(state.score)),
        switchMap(this.makeInterval),


        
      )
  }

  render() {
    return (
      <>
        <div ref={e => this.$timer = e} id={style.timer}>123</div>
        <div ref={e => this.$dot = e} id={style.dot}>321</div>
      </>
    )
  }
}