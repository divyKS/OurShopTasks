import React, { useState, useEffect } from 'react';
import useAxiosFetch from '../Hooks/useAxiosFetch';
import Note from './Note';

const NotesList = () => {
	const { data, isLoading, isSuccess, isError, error } = useAxiosFetch(
		'http://localhost:3500/notes'
	);

	const [notes, setNotes] = useState([]);

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
			console.log("useEffect reducer ran");
			console.log(updatedData);
			setNotes(updatedData);
		}
	}, [data]);

	

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
	
	if(!isLoading && !isError && isSuccess && notes.length == 0){
		return <div>There are no notes at the moment.</div>
	}

	if (!isLoading && !isError && isSuccess) {
		const tableContent = notes.map((note) => (
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
