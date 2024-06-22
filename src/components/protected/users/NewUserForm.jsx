import { useNavigate } from 'react-router-dom';
import ROLES from '../../../config/roles';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';

const USER_REGEX = new RegExp('^[A-z ]{3,20}$');
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
	const [username, setUsername] = useState('');
	const [validUsername, setValidUsername] = useState(false);
	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(['Employee']);

	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		if (canSave && isSuccess) {
			setUsername('');
			setPassword('');
			setRoles([]);
			navigate('/dashboard/users', { replace: true });
		}
	}, [isSuccess, navigate]);

	const handleOnRoleChange = (e) => {
		const selectedValues = [...e.target.selectedOptions].map(
			(option) => option.value
		);
		setRoles(selectedValues);
	};

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		if (canSave) {
			try {
				setIsLoading(true);
				const postObject = { username, password, roles };
				const response = await axiosPrivate.post('/users', postObject);
				setIsError(false);
				setError(null);
				setIsSuccess(true);
			} catch (error) {
				setIsError(true);
				setError(
					error.response.data.message + ' ' + error.response.status
				);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const canSave =
		roles.length && validUsername && validPassword && !isLoading;

	return (
		<>
			<p>ERROR - {error}</p>

			<form onSubmit={handleOnSubmit}>
				<div>
					<div>Create New User</div>
					<button type="submit" disabled={!canSave}>
						Save
					</button>
				</div>

				<div>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						name="username"
						autoComplete="off"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="off"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="roles">Assigned Roles:</label>
					<select
						name="roles"
						id="roles"
						size={3}
						multiple
						value={roles}
						onChange={handleOnRoleChange}
					>
						{Object.values(ROLES).map((role, index) => (
							<option key={index} value={role}>
								{role}
							</option>
						))}
					</select>
				</div>
			</form>
		</>
	);
};

export default NewUserForm;
