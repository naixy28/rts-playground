import './style.styl'

import * as React from 'react'
import * as ReactDOM from "react-dom"
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';

import asyncComp from './components/asyncComp'
const Apple = asyncComp(() => import('./components/Apple'))
const AlphabetInvasion = asyncComp(() => import('./components/AlphabetInvasion'))
const CatchTheDot = asyncComp(() => import('./components/CatchTheDot'))
const ChasingBall = asyncComp(() => import('./components/ChasingBall'))
const LuckyMachine = asyncComp(() => import('./components/LuckyMachine'))

const Header = () => (
	<ul>
		<li><Link to="/">Apple</Link></li>
		<li><Link to="/phone/al">Alphabet Invasion</Link></li>
		<li><Link to="/phone/ball">Chasing Ball</Link></li>
		<li><Link to="/phone/lucky">Lucky Machine</Link></li>
	</ul>
)

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
				<Redirect to="/phone/apple" />
			</Switch>
			</>
		</BrowserRouter>
	</div>,
	document.getElementById('root')
)