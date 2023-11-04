import React, { useState } from 'react'

export default function Register() {
	const [name, SetName] = useState('');
	const [email, SetEmail] = useState('');
	const [password, SetPassword] = useState('');
	const [recycPrefs, SetRecyclePrefs] = useState(0);
	const [residence, SetResidence] = useState({ city: '', cityCode: 0, street: '', streetNum: '' });
	const [birthDate, SetBirthDate] = useState(new Date(null));

	const [status, SetStatus] = useState('');
	const [profileImage, SetProfileImage] = useState('');

	const HandleImageUpload = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		const base64Image = await toBase64(file);
		SetProfileImage(base64Image);
	}

	const toBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}
	
	async function Submit(event) {
		event.preventDefault();

		let user = { name, email, password, recycPrefs, birthDate, residence, status, profileImage }
		console.log(user);
		let res = await fetch('https://recyclistserver.onrender.com/api/users/register', {
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

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={Submit} autoComplete="off">
				<ul>
					<li><input type='email' placeholder='email' required autoComplete="off"
						onChange={(event) => SetEmail(event.target.value)} /></li>

					<li><input type='password' placeholder='password' required autoComplete="off"
						onChange={(event) => SetPassword(event.target.value)} /></li>

					<li><input type='text' placeholder='name' required
						onChange={(event) => SetName(event.target.value)} /></li>

					<li><input type='number' placeholder='recycPrefs 1-5' required
						onChange={(event) => SetRecyclePrefs(event.target.value)} /></li>

					{/* residence-city, street, street number placeholder='Birth Date'   */}
					<li><input type="date"  
						onChange={(event)=> SetBirthDate(event.target.value)}/>Birth Date</li>

					<li><input type='text' placeholder='city'
						onChange={(event) => SetResidence({ ...residence, city: event.target.value })} /></li>

					<li><input type='text' placeholder='street'
						onChange={(event) => SetResidence({ ...residence, street: event.target.value })} /></li>

					<li><input type='number' placeholder='street number'
						onChange={(event) => SetResidence({ ...residence, streetNum: event.target.value })} /></li>
					{/* residence-city, street, street number */}

					<li><input type='text' placeholder='status'
						onChange={(event) => SetStatus(event.target.value)} /></li>


					<li><input type='file' placeholder='profileImage'
						onChange={HandleImageUpload} /></li>

				</ul>

				<button type='submit'>REGISTER!</button>
			</form>
		</div>
	)
}




// let imageFile = await fetch('http://localhost:5500/upload', {
// 	method:'POST',
// 	headers:{
// 		Accept:"application/json", "Content-type": "application/json",
// 	},
// 	body: JSON.stringify(user)
// })
// let imageData = await imageFile.json();
// let imageUrl = imageData.url;

