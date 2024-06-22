import { useEffect, useRef, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';
import Note from './Note';

const NotesList = () => {
	const [notes, setNotes] = useState([]);
	const [filteredNotes, setFilteredNotes] = useState([]);

	const axiosPrivate = useAxiosPrivate();
	const { username, isAdmin, isManger } = useAuth();
	let secondTime = useRef(false);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchNotes = async () => {
			try {
				const response = await axiosPrivate.get('/notes', {
					signal: controller.signal,
				});
				if (isMounted) {
					setNotes(response.data);
				}
			} catch (err) {
				// if (err.name !== 'CanceledError') {
				console.log(err);
				if (err?.response?.status == 403) {
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
				// }
			}
		};

		if (secondTime.current == true) {
			fetchNotes();
		}

		return () => {
			isMounted = false;
			secondTime.current = true;
			controller.abort();
		};
	}, []);

	useEffect(() => {
		if (notes && !isAdmin && !isManger) {
			const myNotes = notes.reduce((acc, note) => {
				if (note.username == username) {
					acc.push(note);
				}
				return acc;
			}, []);
			setFilteredNotes(myNotes);
		} else {
			setFilteredNotes(notes);
		}
	}, [notes]);

	return (
		<>
			{filteredNotes?.length ? (
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
					<tbody>
						{filteredNotes.map((note, index) => (
							<Note key={index} noteData={note} />
						))}
					</tbody>
				</table>
			) : (
				<p>No notes</p>
			)}
		</>
	);
};

export default NotesList;
