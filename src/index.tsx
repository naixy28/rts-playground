import './style.styl'

import * as React from 'react'
import * as ReactDOM from "react-dom"
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';

import asyncComp from './components/asyncComp'
const Apple = asyncComp(() => import('./components/Apple'))
const AlphabetInvasion = asyncComp(() => import('./components/AlphabetInvasion'))

const Header = () => (
	<ul>
		<li><Link to="/">Apple</Link></li>
		<li><Link to="/phone/al">Alphabet Invasion</Link></li>
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
				<Redirect to="/phone/apple" />
			</Switch>
			</>
		</BrowserRouter>
	</div>,
	document.getElementById('root')
)