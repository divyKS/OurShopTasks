import React, { useState, useEffect } from 'react';
import useAxiosFetch from '../Hooks/useAxiosFetch';
import Note from './Note';
import useAuthRoles from '../Hooks/useAuth';

const NotesList = () => {
	const { data, isLoading, isSuccess, isError, error } = useAxiosFetch(
		'http://localhost:3500/notes'
	);

	const [notes, setNotes] = useState([]);
	const [filteredNotes, setFilteredNotes] = useState([]);

	const { username, isManger, isAdmin } = useAuthRoles();


	useEffect(() => {
		if (Array.isArray(data) && data.length != 0) {
			const updatedData = data.reduce((accumulator, note) => {
				const { _id, ...rest } = note;
				const newNoteObject = {
					id: _id,
					...rest,
				};
				accumulator.push(newNoteObject);
				return accumulator;
			}, []);
			console.log(updatedData);
			setNotes(updatedData);
		}
	}, [data]);

	useEffect(()=>{
		// if the notes have arrived and the user is not admin nor manager, then it is employee so should see only his notes
		if(notes && !isAdmin && !isManger){
			const myNotes = notes.reduce((acc, note) => {
				if(note.username == username){
					acc.push(note);
				}
				return acc;
			}, []);
			setFilteredNotes(myNotes);
		}
		else{
			setFilteredNotes(notes);
		}
	}, [notes]);
	

	if (isLoading) {
		return (
			<>
				<p>Loading...</p>
			</>
		);
	}

	if (!isLoading && isError) {
		return (
			<>
				<p>There has been an error</p>
				<p>{error.response.data.message}</p>
				<p>{error.response.status}</p>
			</>
		);
	}
	
	if(!isLoading && !isError && isSuccess && filteredNotes.length == 0){
		return <div>There are no notes at the moment.</div>
	}

	if (!isLoading && !isError && isSuccess) {
		const tableContent = filteredNotes.map((note) => (
			<Note key={note.id} noteData={note}></Note>
		));

		return (
			<>
				<table>
					<thead>
						<tr>
							<th>Status</th>
							<th>Username</th>
							<th>Created</th>
							<th>Updated</th>
							<th>Title</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>{tableContent}</tbody>
				</table>
			</>
		);
	}
};

export default NotesList;
