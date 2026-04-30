import React, { useEffect, useState } from 'react'
import { createContext } from 'react'

export default function AllCars({ sessionToken }) {

	let [cars, setCars] = useState([])
	console.log(cars)

	useEffect(() => {
		const APIPost = async () => {
			try {
				const url = "http://127.0.0.1:4000/api/all"
				const res = await fetch(url, {
					method: "GET",
					headers: new Headers({
						"Content-Type": "application/json",
						"authorization": sessionToken
					})
				})

				const data = await res.json()
				setCars(data)

			} catch (err) {
				console.log(err)
			}
		}

		APIPost()
	}, [])


	const renderData = () => {
		return !cars ? "Loading" : cars.map((car) =>
		(<div key={car.id}>
			<h4>{car.make}</h4>
			<p>{car.model}</p>
			<p>{car.year}</p>
			<p>{car.mileage}</p>
		</div>)
		)
	}


	return (
		<div>{renderData()}</div>
	)
}


