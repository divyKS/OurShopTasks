import { useNavigate } from 'react-router-dom';
import ROLES from '../../../config/roles';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

const USER_REGEX = new RegExp('^[A-z ]{3,20}$');
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
	const [username, setUsername] = useState('');
	const [validUsername, setValidUsername] = useState(false);
	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(['Employee']);
	const [active, setActive] = useState(true);

	const [isUpdateLoading, setIsUpdateLoading] = useState(false);
	const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
	const [isUpdateError, setIsUpdateError] = useState(false);
	const [uptError, setUptError] = useState(null);

	const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isDelSuccess, setIsDelSuccess] = useState(false);
	const [isDelError, setIsDelError] = useState(false);
	const [delError, setDelError] = useState(null);

	const navigate = useNavigate();

	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		if (user) {
			setUsername(user.username);
			setRoles(user.roles);
			setActive(user.active);
		}
	}, [user]);

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		if (isUpdateSuccess || isDelSuccess) {
			setUsername('');
			setPassword('');
			setRoles([]);
			navigate('/dashboard/users', { replace: true });
		}
	}, [isUpdateSuccess, isDelSuccess, navigate]);

	const handleOnRoleChange = (e) => {
		// console.log(Array.from(e.target.selectedOptions))
		// console.log(e)
		// const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value)
		const selectedValues = [...e.target.selectedOptions].map(
			(option) => option.value
		);
		setRoles(selectedValues);
	};

	const handleActiveChange = (e) => {
		setActive((prevActive) => !prevActive);
	};

	const handleOnSubmit = async (e) => {
		e.preventDefault();

		let patchObject = {};

		if (password) {
			patchObject = { id: user._id, username, roles, active, password };
		} else {
			patchObject = { id: user._id, username, roles, active };
		}

		try {
			setIsUpdateLoading(true);
			const response = await axiosPrivate.patch('/users', patchObject);
			console.log('updated user data - ' + JSON.stringify(response.data));
			setIsUpdateError(false);
			setUptError(null);
			setIsUpdateSuccess(true);
		} catch (error) {
			setIsUpdateError(true);
			setUptError(error.message);
		} finally {
			setIsUpdateLoading(false);
		}
	};

	const handleOnDelete = async (e) => {
		e.preventDefault();
		try {
			setIsDeleteLoading(true);

			const response = await axiosPrivate.delete('/users', {
				data: {
					id: user._id,
				},
			});
			console.log('deleted user data - ' + JSON.stringify(response.data));
			setIsDelError(false);
			setDelError(null);
			setIsDelSuccess(true);
		} catch (error) {
			setIsDelError(true);
			setDelError(error.response.data.message);
		} finally {
			setIsDeleteLoading(false);
		}
	};

	const canSave = password
		? roles?.length && validUsername && validPassword && !isUpdateLoading
		: roles?.length && validUsername && !isUpdateLoading;

	return (
		<>
			<p>ERROR - {uptError || delError}</p>

			<form onSubmit={(e) => e.preventDefault()}>
				<div>
					<div>Update User {user.username}</div>
					<button disabled={!canSave} onClick={handleOnSubmit}>
						Update
					</button>
					<button onClick={handleOnDelete}>Delete</button>
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

				<div>
					<label htmlFor="active">Active:</label>
					<input
						type="checkbox"
						id="active"
						name="active"
						checked={active}
						onChange={handleActiveChange}
					/>
				</div>
			</form>
		</>
	);
};

export default EditUserForm;
