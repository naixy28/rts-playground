import * as React from 'react'
import { BehaviorSubject, interval, empty } from 'rxjs'
import { switchMap, scan } from 'rxjs/operators'


interface Letter {
  letter: String;
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
}

const randomLetter = (): string => String.fromCharCode(Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0))
const levelChangeThreshold = 20
const speedAdjust = 50
const endThreshold = 15
const gameWith = 30
const initSpeed = 600

class AlphabetInvasion extends React.Component {
  state = {
    intervalSubject: null,
    letters$: null,
  }

  componentWillUnmount() {
    this.state.letters$.next(0)
  }

  componentDidMount() {
    const intervalSubject = new BehaviorSubject(initSpeed)
    const letters$ = intervalSubject.pipe(
      switchMap(i => i ? interval(i) : empty()
        .pipe(
          scan<number, Letters>(letters => ({
            intrvl: i,
            ltrs: [
              {
                letter: randomLetter(),
                yPos: ~~ (Math.random() * gameWith)
              },
              ...letters.ltrs
            ]
          }), { ltrs: [], intrvl: 0 })
        )
      )
    )

    letters$.subscribe(console.log)

    this.setState({
      intervalSubject,
      letters$,
    })
  }

  render() {
    return (
    <div>
      space
    </div>)
  }
}

export default AlphabetInvasion