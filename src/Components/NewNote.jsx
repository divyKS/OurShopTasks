import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewNoteForm from './NewNoteForm';
import {useAuth} from '../Context/AuthContext.jsx';

const NewNote = () => {
	const [users, setUsers] = useState([]);
    const { authToken: accessToken } = useAuth();
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(()=>{
		async function getAllUsers(){
			try{
				setIsLoading(true);
				const response = await axios.get("http://localhost:3500/users", { headers: { Authorization: `Bearer ${accessToken}` }});
				// console.log(response.data);
				setUsers(response.data);
				// console.log(users);
			}
			catch(e){
				setIsError(true);
				// console.log(e.message);
				setError(e);
			}
			finally{
				setIsLoading(false);
			}
		}
		getAllUsers();
	}, []);

	if(isError && !isLoading){
		return (
			<>	
				<p>Error has occurred</p>
				<p>{error.response.data.message}</p>
				<p>{error.response.status}</p>
			</>
		)
	}

	return (
		<>
			{/* <div>Hi!</div> */}
			{users.length? <NewNoteForm users={users} /> : <p>Loading...</p>}
		</>
	);
};

export default NewNote;
