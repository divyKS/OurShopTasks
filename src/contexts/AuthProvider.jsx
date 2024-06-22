import { jwtDecode } from 'jwt-decode';
import { useState, createContext } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false);

	const accessToken = auth?.accessToken;

	let username = null;
	let roles = [];

	if (accessToken) {
		const decoded = jwtDecode(accessToken);
		username = decoded.UserInfo.username;
		roles = decoded.UserInfo.roles;
	}

	const isManager = roles.includes('Manager');

	const isAdmin = roles.includes('Admin');

	const status = roles
		? isAdmin
			? 'Admin'
			: isManager
			? 'Manager'
			: 'Employee'
		: null;

	return (
		<AuthContext.Provider
			value={{ auth, setAuth, persist, setPersist, username, roles, isManager, isAdmin, status }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
