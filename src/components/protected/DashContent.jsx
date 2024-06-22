import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DashContent = () => {
	const { isManager, isAdmin } = useAuth();
	return (
		<>
			<p><Link to="notes">view notes</Link></p>
			<p><Link to="notes/new">add new note</Link></p>
			{isManager || isAdmin ? (
				<>
					<p><Link to="users">view users</Link></p>
					<p><Link to="users/new">add new user</Link></p>
				</>
			) : null}
		</>
	);
};

export default DashContent;
