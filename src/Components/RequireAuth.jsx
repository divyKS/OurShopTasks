import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import useAuthRoles from '../Hooks/useAuth';
import useAuth from '../Hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    // const { roles } = useAuthRoles()
	const { auth } = useAuth();
	const location = useLocation();

    return (
        <>
            {auth?.roles?.some((role)=>allowedRoles.includes(role))}
                ? <Outlet />
                : {auth?.user}
                    ? <Navigate to='/unauthorized' />
                    : <Navigate to='/login' state={{from: location}} replace={true} />

        </>
    )


	// if in the roles that this person has is an allowed role then we were just a outlet otherwise we will send the user to /login again
	// array.some(function to check on each value of the array)
	// if (roles.some((role) => allowedRoles.includes(role))) {
	// 	return <Outlet />;
	// } else {
	// 	// navigate has to be returned too!!
	// 	// !TODO not sure how it works, started to stay where logged out, could log in properly with other accounts
	// 	// return <Navigate to='/login' state={{from:location}} replace/>
	// 	return <Navigate to="/login" replace={true} />;
	// }
};

export default RequireAuth;
