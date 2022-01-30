import * as React from "react"
import { FunctionComponent } from "react"
import { BehaviorSubject, interval, throwError, of, from, EMPTY, merge } from "rxjs"
import { mergeMap, retry, map, retryWhen, scan, catchError, switchMap, tap } from "rxjs/operators"

const Retry: FunctionComponent = () => {
  const subject = React.useMemo(() => {
    return new BehaviorSubject<any>(0)
  }, [])
  const source = React.useMemo(() => {
    return interval(1000).pipe(
      map(val => {
        if (val > 5) {
          throw new Error('eeee')
          // return throwError('Error')
        }
        return val
        // return of(val)
      }),
      // retry(2)
      retryWhen(ob => 
        ob.pipe(
          scan((acc) => {
            return acc += 1
          }, 0),
          map(val => {
            console.log(val)
            // throw  new Error('ffff')
            if (val > 2) {
              throw  new Error('ffff')
            } else {
              return val
            }
          })
        )
      )
    )
  }, [])

  // const sourcePrmoise = React.useMemo(() => {
  //   return from(new Promise((resolve, reject) => {
  //     console.log('promise start')
  //     setTimeout(() => {reject('111')}, 1000)
  //   })).pipe(
  //     catchError((err, caught) => {
  //       return from(new Promise((resolve, reject) => {
  //         console.log('promise start')
  //         setTimeout(() => {reject('111')}, 1000)
  //       }))
  //     })
      
  //   )
  // }, [])

  const sourcePromise2 = React.useMemo(() => {
    
    return subject.pipe(
      tap(console.log),
      switchMap(val => from(new Promise((resolve, reject) => {
        console.log('promise start')
        setTimeout(() => {reject('2222')}, 1000)
      })).pipe(
        // retryWhen(err$ => {
        //   return err$.pipe(
        //     scan((acc) => acc++, 0),
        //     map(val => val <= 2 ? val: val)
        //   )
        // }),
        // catchError((e) => {
        //   return EMPTY
        // })
      )),
      // retry(3),
      // catchError((e) => {
      //   return of(1)
      // })
    )
  }, [])
  
  const handleClick1 = React.useCallback(() => {
    subject.next(new Error('error!'))
  }, [subject])
  const handleClick2 = React.useCallback(() => {
    subject.next('value')
  }, [subject])

  React.useEffect(() => {
    // subject.subscribe((arg) => {
    //   console.log(arg)
    // })

    sourcePromise2.subscribe({
      next: val => console.log('Next', val),
      error: val => console.log('Retry', val),
      complete: () => console.log('Complete')
    })
  }, [source])
  return (
  <>
    <button onClick={handleClick1}>Emit Error</button>
    <button onClick={handleClick2}>Emit Value</button>
  </>)
}

export default Retry