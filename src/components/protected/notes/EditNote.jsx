import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import EditNoteForm from './EditNoteForm';

const EditNote = () => {
	const { noteID } = useParams();

	const [note, setNote] = useState(null);
	const [users, setUsers] = useState([]);
	const [noteOwner, setNoteOwner] = useState(null);

	const axiosPrivate = useAxiosPrivate();

	const { username, isManager, isAdmin } = useAuth();

	let secondTime = useRef(false);
    
	useEffect(() => {
        let isMounted = true;
		const controller = new AbortController();

		const getNote = async () => {
			try {
				const response = await axiosPrivate.get(`http://localhost:3500/notes/${noteID}`, {signal: controller.signal});
				if (isMounted) {
					setNote(response.data);
				}
			} catch (err) {
				console.error(err);
                if(err?.response?.status == 403){
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
			}
		};

		if (secondTime.current == true) {
			getNote();
		}

		return () => {
			controller.abort();
            secondTime.current = true;
            isMounted = false;
		};
	}, [noteID]);

	useEffect(() => {
        let isMounted = true;
		const controller = new AbortController();

		const getUsers = async () => {
			try {
				const response = await axiosPrivate.get(`http://localhost:3500/users`, {signal: controller.signal});
				if (isMounted) {
					setUsers(response.data);
				}
			} catch (err) {
				console.error(err);
                if(err?.response?.status == 403){
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
			}
		};

		if (note) {
			getUsers();
		}

		return () => {
			controller.abort();
            secondTime.current = true;
            isMounted = false;
		};
	}, [note]);

	useEffect(() => {
        let isMounted = true;
		const controller = new AbortController();

		const getOwnerOfNote = async () => {
			try {
				const response = await axiosPrivate.get(`http://localhost:3500/users/${note.user}`,{signal: controller.signal});
				if (isMounted) {
					setNoteOwner(response.data.username);
				}
			} catch (err) {
				console.log(err);
                if(err?.response?.status == 403){
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
			}
		};

        // without this length, this function is called when users is still [] , so in between this request the users get populated []
        // do the dependency of this useEffect changes hence the request is cancelled and resent when this run for the second time
		if (note && users.length) {
			getOwnerOfNote();
		}

		return () => {
			controller.abort();
            secondTime.current = true;
            isMounted = false;
		};
	}, [note, users]);

    if (!isAdmin && !isManager && noteOwner !== username) {
		return <p>No access</p>;
	} else {
		return (
			<>
				{note && users && noteOwner ? (
					<EditNoteForm note={note} users={users} />
				) : (
					<p>Loading...</p>
				)}
			</>
		);
	}
};

export default EditNote;
