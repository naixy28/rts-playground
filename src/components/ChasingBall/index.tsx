import * as React from 'react'
import { } from 'rxjs'

const style = require('./style2.styl')

class ChasingBall extends React.Component {

  componentDidMount() {
    // debugger
  }
  render() {
    return (
      <div className={style.area}>
        <div className={style.ball}>test</div>
      </div>
    )
  }
}

export default ChasingBall