// !TODO: add its own css classes, using the css from the new user form

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../Context/AuthContext.jsx';

const NewNoteForm = ({ users }) => {
	const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
	
	const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [userId, setUserId] = useState(users[0]._id);

    const { authToken: accessToken } = useAuth();

	useEffect(() => {
        if (isSuccess) {
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dashboard/notes');
        }
    }, [isSuccess, navigate]);

	let canSave = [title, text, userId].every(Boolean) && !isLoading;

	const handleOnSubmit = async (e) => {
        e.preventDefault()
        if (canSave) {
			// call to create note with userId, title, text
			try{
				setIsLoading(true);
				const postObject = { "user": userId, title, text };
				const response = await axios.post("http://localhost:3500/notes", postObject, { headers: { Authorization: `Bearer ${accessToken}` }});
				console.log(response.data);
				setIsError(false);
                setError(null);
				setIsSuccess(true);
			}
			catch(e){
				setIsSuccess(false);
				setIsError(true);
				setError(e.message);
				console.error(e);
			}
			finally{
				setIsLoading(false);
			}
        }
    };

	const errorCSS = isError ? "errorMessage" : "noErrorMessage";

	return (
		<>
			<p className={errorCSS}>{error?.data?.message}</p>

			<form className="newUserForm" onSubmit={handleOnSubmit}>

				<div className="newUserFormHeading">
					<div>New Note</div>
					<button type='submit' disabled={!canSave}>Save</button>					
				</div>

                <div className='newUserFormContent'>
					<label htmlFor="title">Title:</label>
					<input
						type="text"
						id="title"
						name="title"
						autoComplete="off"
						value={title}
						onChange={(e)=>setTitle(e.target.value)}
					/>
				</div>

                <div className='newUserFormContent'>
					<label htmlFor="text">Text:</label>
					<textarea
						id="text"
						name="text"
						value={text}
						onChange={(e)=>setText(e.target.value)}
					/>
				</div>

                <div className='newUserFormContent'>
					<label htmlFor="assignedto">ASSIGNED TO:</label>
					<select
						id="assignedto"
						name="assignedto"
						value={userId}
						onChange={(e)=>setUserId(e.target.value)}
					>
						{

							users.map((user)=>{
								// console.log(user);
								// console.log(user._id);
								return (
									<option key={user._id} value={user._id}>
										{user.username}
									</option>
								)
							})
						}
					</select>
				</div>

			</form>
		</>
	);
};

export default NewNoteForm;
