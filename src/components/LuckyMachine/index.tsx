import * as React from 'react'

import Blocks from './Blocks'
import { Events } from './types'
import { Subject, interval, merge, from, BehaviorSubject, concat, of, timer, pipe } from 'rxjs'
import { switchMap, tap, takeUntil, share, take, switchMapTo, concatMap, publish, withLatestFrom, map, takeWhile, first } from 'rxjs/operators';

import { create } from 'rxjs-spy'
import { tag } from 'rxjs-spy/operators'

type State = {
  active: number,
  lock: boolean,
}

export default class LuckyMachine extends React.Component<any, State>{

  state = {
    active: 2,
    lock: false,
  }

  startSubject = new Subject<number>()

  fetchResult$ = this.startSubject.pipe(
    switchMap(() => {
      return from(new Promise(resolve => {
        setTimeout(() => {
          const result = ~~(Math.random() * 8)
          this.lock(false)
          resolve(result)
        }, 2000)
      }))
    }),
    share(),
    tag('fetch')
  )

  fakeRolling$ = this.startSubject.pipe(
    tap(() => {
      this.lock()
    }),
    
    switchMap(() => {
      return interval(100).pipe(
        tap(() => {
          this.setState({active: this.state.active + 1})
        }),
        takeUntil(this.fetchResult$),
        tag('fake rolling')
      )
    }),
  )

  intervalSubject = new Subject<number>()

  interval$ = this.intervalSubject.pipe(
    tap(v => {console.log('interval: ', v)}), // eslint-disable-line
    switchMap((i: number) => timer(i).pipe(first())),
    share()
  )

  realRolling$ = this.fetchResult$.pipe(
    switchMap((v: number) => {
      const rollCount = v + 16 - (this.state.active % 8)
      let currRollCount = 0
      let speed = 150

      this.intervalSubject.next(speed)

      return concat(this.interval$.pipe(
        tap(() => {
          this.setState({active: this.state.active + 1})
          currRollCount += 1
          this.intervalSubject.next(speed += 50)
        }),
        takeWhile(() => {
          console.log(v, (this.state.active % 8), rollCount)  // eslint-disable-line
          const condition = !(v === (this.state.active % 8) && currRollCount === rollCount)
          
          return condition
        }),
        tag('slowing interval')
      ), of(1).pipe(
        tag('end')
      ))
    }),
    tag('real rolling')
  )

  

  lock = (v = true) => {
    this.setState({
      lock: v
    })
  }

  blockHandler = (type: Events, payload: any) => {
    if (this.state.lock) return

    switch (type) {
      case Events.START:
        this.startSubject.next()
    }
  }

  componentDidMount() {
    const spy = create()

    spy.log(/\w*/)
    merge(
      this.fakeRolling$,
      // concat(this.realRolling$, this.showResult$),
      this.realRolling$,
      this.interval$,
    ).subscribe()
  }

  render() {
    return (
      <div className="wrao">
        <Blocks active={this.state.active} handler={this.blockHandler}/>
      </div>
    )
  }
}