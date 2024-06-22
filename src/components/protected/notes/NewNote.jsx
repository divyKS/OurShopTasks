import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';
import NewNoteForm from './NewNoteForm';
import { useEffect, useRef, useState } from 'react';

const NewNote = () => {
	const [users, setUsers] = useState([]);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const axiosPrivate = useAxiosPrivate();
	const { username, isManager, isAdmin } = useAuth();

	let secondTime = useRef(false);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getAllUsers = async () => {
			try {
				setIsLoading(true);
				const response = await axiosPrivate.get('/users', {
					signal: controller.signal,
				});
				if (isMounted) {
					setUsers(response.data);
				}
			} catch (e) {
				setError(e);
				if (e?.response?.status == 403) {
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
				if (isMounted) {
					setIsError(true);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		if (secondTime.current == true) {
			getAllUsers();
		}

		return () => {
			isMounted = false;
			secondTime.current = true;
			controller.abort();
		};
	}, []);

	if (isError && !isLoading) {
		return (
			<>
				<p>Error has occurred</p>
				<p>{error.response.data.message}</p>
				<p>{error.response.status}</p>
			</>
		);
	}

	return (
		<>
			{/* <div>Hi!</div> */}
			{users.length ? <NewNoteForm users={users} /> : <p>Loading...</p>}
		</>
	);
};

export default NewNote;
