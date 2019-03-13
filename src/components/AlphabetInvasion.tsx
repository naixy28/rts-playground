import * as React from 'react'
import { BehaviorSubject, interval, empty, fromEvent, combineLatest, Observable } from 'rxjs'
import { switchMap, scan, startWith, map, takeWhile } from 'rxjs/operators'

interface Letter {
  letter: string;
  yPos: number;
}
interface Letters {
  ltrs: Letter[];
  intrvl: number;
}
interface State {
  score: number;
  letters: Letter[];
  level: number;
  gameStatus?: GameStatus
}

enum GameStatus {
  start,
  end
}

const randomLetter = (): string => String.fromCharCode(Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0))
const noop = () => {}

const levelChangeThreshold = 20
const speedAdjust = 50
const endThreshold = 15
const gameWith = 30
const initSpeed = 600

class AlphabetInvasion extends React.Component<any, State> {
  public intervalSubject!: BehaviorSubject<number>
  public letters$!: Observable<Letters> | BehaviorSubject<number> // rxjs在类型推断上有问题 或者这里就直接any
  public keys$!: Observable<string>
  public game$: Observable<any>
  public $el!: HTMLDivElement

  state: State = {
    score: 0,
    letters: [],
    level: 1,
    gameStatus: GameStatus.start
  }

  componentWillUnmount() {
    (this.letters$ as  BehaviorSubject<number>).next(0) // 利用了联合类型的类型断言
  }

  componentDidMount() {
    this.intervalSubject = new BehaviorSubject(initSpeed)
    this.letters$ = this.intervalSubject.pipe(
      switchMap(i => i
        ? interval(i).pipe(
          scan<number, Letters>(letters => ({
            intrvl: i,
            ltrs: [
              {
                letter: randomLetter(),
                yPos: ~~ (Math.random() * gameWith)
              },
              ...letters.ltrs
            ]
          }), { ltrs: [], intrvl: 0 }),
        )
        : empty()
      )
    )

    this.keys$ = fromEvent(document, 'keydown')
      .pipe(
        startWith({ key: '' }),
        map((e: KeyboardEvent) => e.key)
      )

    this.game$ = combineLatest(this.keys$, this.letters$)
      .pipe(
        scan< [string, Letters], State>((state, [key, letters]) => (
          letters.ltrs[letters.ltrs.length - 1]
            && letters.ltrs[letters.ltrs.length - 1].letter === key
            ? (state.score += 1, letters.ltrs.pop())
            : noop,

          state.score > 0 && state.score % levelChangeThreshold === 0
            ? (
              letters.ltrs = [],
              state.level += 1,
              state.score += 1,
              this.intervalSubject.next(letters.intrvl - speedAdjust)
            )
            : noop,

            { score: state.score, letters: letters.ltrs, level: state.level }
        ), { score: 0, letters: [], level: 1 }),
        takeWhile(state => state.letters.length < endThreshold)
      )
        
    this.game$.subscribe(
      (state: State) => {
        this.setState(state)
      },
      noop,
      () => {
        this.setState({
          gameStatus: GameStatus.end,
        })
      }
    )
  }

  renderGame(state: State) {
    let innerHtml = `Score: ${this.state.score}, Level: ${this.state.level} <br/>`

    state.letters.forEach(l => {
      innerHtml += '&nbsp'.repeat(l.yPos) + l.letter + '<br/>'
    })
    innerHtml += '<br/>'.repeat(endThreshold - state.letters.length - 1) + '-'.repeat(gameWith)

    return innerHtml
  }

  renderGameOver() {
    return '<br/>GAME OVER!'
  }

  render() {
    const text = this.renderGame(this.state) + (this.state.gameStatus === GameStatus.end ? this.renderGameOver() : ''
  )

    return (
    <div ref={el => this.$el = el} dangerouslySetInnerHTML={{ __html: text }}>
    </div>)
  }
}

export default AlphabetInvasion