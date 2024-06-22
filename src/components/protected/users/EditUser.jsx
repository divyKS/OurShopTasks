import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import EditUserForm from './EditUserForm';

const EditUser = () => {
	const { userID } = useParams();
	const [user, setUser] = useState(null);

	const secondTime = useRef(false);

	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUser = async () => {
			try {
				const response = await axiosPrivate(`/users/${userID}`, {
					signal: controller.signal,
				});
				if (isMounted) {
					setUser(response.data);
				}
			} catch (err) {
				console.log(err);
				if (err?.response?.status == 403) {
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
			}
		};

		if (secondTime.current == true) {
			getUser();
		}

		return () => {
			isMounted = false;
			secondTime.current = true;
			controller.abort();
		};
	}, [userID]);

	return <>{user ? <EditUserForm user={user} /> : <p>Loading...</p>}</>;
};

export default EditUser;
