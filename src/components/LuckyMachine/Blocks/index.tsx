import * as React from 'react'
import { Events } from '../types'

const style = require('./style.styl')

type Props = {
  active: number,
  handler: (type: Events, payload: any) => void
}

const blockMapping = {
  0: 0,
  1: 1,
  2: 2,
  3: 5,
  4: 8,
  5: 7,
  6: 6,
  7: 3,
}

const reverseMapping = {
  0: 0,
  1: 1,
  2: 2,
  3: 7,
  4: 'center',
  5: 3,
  6: 6,
  7: 5,
  8: 4,  
}

export default class LuckyBlocks extends React.PureComponent<Props> {
  handleClick(index: number) {
    this.props.handler(Events.START, index)
  }
  render() {
    return (
      <div className={style.blocks}>
        {
          Array.from({ length: 9 }).map((_, index) => {
            let className = style.block
            if (this.props.active % 8 === reverseMapping[index]) {
              className += ' active'
            }

            return (
              <div
                className={className}
                key={index}
                onClick={() => {index === 4 && this.handleClick(index)}}
              >
                { reverseMapping[index] }
              </div>
            )
          })
        }
      </div>
    )
  }
}