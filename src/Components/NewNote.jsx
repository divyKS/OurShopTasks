import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewNoteForm from './NewNoteForm';

const NewNote = () => {
	const [users, setUsers] = useState([]);

	useEffect(()=>{
		async function getAllUsers(){
			try{
				const response = await axios.get("http://localhost:3500/users");
				// console.log(response.data);
				setUsers(response.data);
				// console.log(users);
			}
			catch(e){
				console.log(e.message);
			}
		}
		getAllUsers();
	}, []);

	return (
		<>
			{/* <div>Hi!</div> */}
			{users.length? <NewNoteForm users={users} /> : <p>Loading...</p>}
		</>
	);
};

export default NewNote;
