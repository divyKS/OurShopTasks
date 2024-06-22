import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
	const { roles, username } = useAuth();
	const location = useLocation();

	return (
		<>
			{roles.some((role) => allowedRoles.includes(role)) ? (
				<Outlet />
			) : username ? (
				<Navigate
					to="/unauthorized"
					state={{ from: location }}
					replace={true}
				/>
			) : (
				<Navigate
					to="/login"
					state={{ from: location }}
					replace={true}
				/>
			)}
		</>
	);
};

export default RequireAuth;
