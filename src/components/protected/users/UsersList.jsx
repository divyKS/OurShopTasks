import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import User from './User';

const UsersList = () => {
	const [users, setUsers] = useState([]);

	const secondTime = useRef(false);

	const navigate = useNavigate();
	const location = useLocation();

	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchUsers = async () => {
			try {
				const response = await axiosPrivate.get('/users', {
					signal: controller.signal,
				});
				if (isMounted) {
					setUsers(response.data);
				}
			} catch (err) {
				// if (err.name !== 'CanceledError') {
				console.log(err);
				if(err?.response?.status == 403){
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
				// }
			}
		};

		if (secondTime.current == true) {
			fetchUsers();
		}

		return () => {
			isMounted = false;
			secondTime.current = true;
			controller.abort();
		};
	}, []);

	return (
		<>
			<h3>TechShop Users</h3>
			{users?.length ? (
				<table>
					<thead>
						<tr>
							<th>Username</th>
							<th>Roles</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => {
							return <User key={index} userData={user} />;
						})}
					</tbody>
				</table>
			) : (
				<p>No users.</p>
			)}
		</>
	);
};

export default UsersList;
