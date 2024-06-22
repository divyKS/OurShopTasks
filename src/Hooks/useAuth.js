import { jwtDecode } from 'jwt-decode';
// import { useAuth } from '../Context/AuthContext.jsx';
import AuthContext from '../Context/AuthProvider';
import { useContext } from 'react';

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;


// const useAuthRoles = () => {

// 	const { authToken: accessToken } = useAuth();
// 	let isManager = false;
// 	let isAdmin = false;
// 	let status = 'Employee';

// 	if (accessToken) {
// 		const decoded = jwtDecode(accessToken);
// 		const { username, roles } = decoded.UserInfo;
// 		if (roles.includes('Manager')){
//             isManager = true;
//             status = 'Manager';
//         }
// 		if (roles.includes('Admin')){
//             isAdmin = true;
//             status = 'Admin';
//         }

//         return { username, roles, status, isManager, isAdmin };
// 	}
//     else{
//         return { username: "", roles: [], status, isManager, isAdmin };
//     }
// };

// export default useAuthRoles;
