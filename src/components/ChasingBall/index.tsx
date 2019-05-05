import * as React from 'react'
import { Observable, of, fromEvent, Subject, Subscription } from 'rxjs'
import { expand, filter, map, tap, throttleTime, withLatestFrom } from 'rxjs/operators';

const style = require('./style2.styl')

interface IPosition {
  left: number
  top: number
}
interface IFrameData {
  frameStartTime: number
  deltaTime: number
}

let velocity = 500

const calculateStep: (prevFrame: IFrameData) => Observable<IFrameData> = (prevFrame: IFrameData) => {
  return Observable.create(observer => {
    requestAnimationFrame(frameStartTime => {
      const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0

      observer.next({
        frameStartTime,
        deltaTime,
      })
    })
  })
}

class ChasingBall extends React.Component<any, IPosition> {

  public state: IPosition = {
    left: 10,
    top: 10,
  }
  private gameSubscription: Subscription
  private frame$: Observable<number> = of(undefined)
    .pipe(
      expand(val => calculateStep(val)),
      filter(frame => frame !== undefined),
      map(frame => frame.deltaTime)
    )
  private mouseSubject: Subject<IPosition> = new Subject()
  private mouseMove$: Observable<IPosition> = this.mouseSubject.pipe(
      throttleTime(50),
    )
  
  handleMouseEnter = () => {
    this.gameSubscription = this.frame$
      .pipe(
        withLatestFrom(this.mouseMove$),
        map(([deltaTime, position]) => this.update(deltaTime, position, this.state)),
      )
      .subscribe(({left, top}) => {
        this.setState({
          left,
          top
        })
      })
  }
    
  handleMouseMove = (e: React.MouseEvent) => {
    e.persist()
    
    this.mouseSubject.next({
      left: e.nativeEvent.offsetX,
      top: e.nativeEvent.offsetY,
    })
  }
  handleMouseLeave = () => {
    this.gameSubscription.unsubscribe()
  }

  update(deltaTime: number, position: IPosition, prevPosition: IPosition): IPosition {
    if (position && prevPosition) {
      const deltaX = ~~(position.left - prevPosition.left)
      const deltaY = ~~(position.top - prevPosition.top)

      if (Math.abs(deltaX) <= 5 && Math.abs(deltaY) <= 5) {
        return prevPosition
      }

      let velocityX = velocity / Math.sqrt(1 + (deltaY * deltaY) / (deltaX * deltaX))
      let velocityY = Math.sqrt(velocity * velocity - velocityX * velocityX)

      velocityX = deltaX === Math.abs(deltaX) ? velocityX : -1 * velocityX
      velocityY = deltaY === Math.abs(deltaY) ? velocityY : -1 * velocityY

      return {
        left: prevPosition.left + deltaTime * velocityX,
        top: prevPosition.top + deltaTime * velocityY,
      }
    }

    return prevPosition
  }

  // componentDidMount() {
  //   this.gameSubscription = this.frame$
  //     .pipe(
  //       withLatestFrom(this.mouseMove$),
  //       map(([deltaTime, position]) => this.update(deltaTime, position, this.state)),
  //     )
  //     .subscribe(({left, top}) => {
  //       this.setState({
  //         left,
  //         top
  //       })
  //     })
  // }

  render() {
    return (
      <div
       className={style.area}
       onMouseEnter={this.handleMouseEnter}
       onMouseMove={this.handleMouseMove}
       onMouseLeave={this.handleMouseLeave}
      >
        <div
          className={style.ball}
          style={{left: this.state.left, top: this.state.top}}></div>
      </div>
    )
  }
}

export default ChasingBall