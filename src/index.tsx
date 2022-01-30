import './style.styl'

import * as React from 'react'
import * as ReactDOM from "react-dom"
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import Retry from './components/Retry'


import { shaking2 } from './utils/math'

import asyncComp from './components/asyncComp'
const Apple = asyncComp(() => import(/* webpackChunkName: "apple" */'./components/Apple'))
const AlphabetInvasion = asyncComp(() => import(/* webpackChunkName: "a-invasion" */'./components/AlphabetInvasion'))
const CatchTheDot = asyncComp(() => import(/* webpackChunkName: "catch-dot" */'./components/CatchTheDot'))
const ChasingBall = asyncComp(() => import(/* webpackChunkName: "chasing-ball" */'./components/ChasingBall'))
const LuckyMachine = asyncComp(() => import(/* webpackChunkName: "lucky-machine" */'./components/LuckyMachine'))
const Ring = asyncComp(() => import(/* webpackChunkName: "ring" */'./components/Ring'))

const Header = () => (
	<ul>
		<li><Link to="/">Apple</Link></li>
		<li><Link to="/phone/al">Alphabet Invasion</Link></li>
		<li><Link to="/phone/ball">Chasing Ball</Link></li>
		<li><Link to="/phone/lucky">Lucky Machine</Link></li>
		<li><Link to="/phone/ring">Ring</Link></li>
		<li><Link to="/phone/retry">Retry</Link></li>
	</ul>
)

console.log(shaking2) // eslint-disable-line

ReactDOM.render(
	<div>
		<BrowserRouter>
			<>
			<Header />
			<Switch>
				<Route path="/phone/apple" component={Apple} />
				<Route path="/phone/al" component={AlphabetInvasion} />
				<Route path="/phone/dot" component={CatchTheDot} />
				<Route path="/phone/ball" component={ChasingBall} />
				<Route path="/phone/lucky" component={LuckyMachine} />
				<Route path="/phone/ring" component={Ring} />
				<Route path="/phone/retry" component={Retry} />
				<Redirect to="/phone/apple" />
			</Switch>
			</>
		</BrowserRouter>
	</div>,
	document.getElementById('root')
)