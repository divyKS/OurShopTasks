import { useNavigate } from 'react-router-dom';

const User = ({ userData }) => {
	const navigate = useNavigate();
	
    const handleEdit = () => {
		navigate(`/dashboard/users/${userData._id}`);
	};

	return (
		<>
			<tr>
				<td>{userData.username}</td>
				<td>{userData.roles}</td>
				<td>
					<button onClick={handleEdit}>Edit</button>
				</td>
			</tr>
		</>
	);
};

export default User;
