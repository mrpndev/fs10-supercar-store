import { useEffect, useState } from 'react'
import Auth from './components/Auth/Auth'
import AllCars from './components/AllCars/AllCars'
import './App.css'

function App() {

	// Access localStorage using it's access point
	// use setItem to pass your key:value pair
	let [sessionToken, setSessionToken] = useState(localStorage.getItem("token"))
	console.log(sessionToken)

	let updateSessionToken = (token) => {
		localStorage.setItem("token", token)
		setSessionToken(token)
	}

	let logoutUser = () => {
		// check if you have a token
		if (localStorage.getItem("token")) {
			// remove the token
			localStorage.removeItem("token")
			// remove the token from React app, too
			setSessionToken(null)
		}
	}

	// helper function to show logout btn only if logged in
	let showLogout = () => sessionToken && (<button onClick={logoutUser} className='primary-btn'>Logout</button>)

	return (
		<>
			{showLogout()}
			{sessionToken ? <AllCars sessionToken={sessionToken} /> : <Auth updateSessionToken={updateSessionToken} />}
		</>
	)
}

export default App
