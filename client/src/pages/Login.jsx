import React, { useState } from 'react'

export default function Login() {
	const [email, SetEmail] = useState('');
	const [password, SetPassword] = useState('');

	async function Submit(event) {
		event.preventDefault();

		let user = { email, password };
		//NOT SURE IF THIS IS GOING TO WORK AT ALLLLLL
		let res = await fetch('https://recyclistserver.onrender.com/api/users/login', { //
			method: 'POST',
			headers: {
				Accept: "application/json",
				"Content-type": "application/json",
			},
			body: JSON.stringify(user)
		})
		let data = await res.json();
		console.log(data);
	}

	return (<div>
		<h1>Login</h1>
		<form onSubmit={Submit} autoComplete='off'>
			<input type='email' placeholder='email' required autoComplete="off"
				onChange={(event) => SetEmail(event.target.value)} />

			<input type='password' placeholder='password' required autoComplete="off"
				onChange={(event) => SetPassword(event.target.value)} />


			<button type='submit'>Login</button>
		</form>
	</div>)
}
