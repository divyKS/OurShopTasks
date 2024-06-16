import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'
import useAuthRoles from '../Hooks/useAuth';

const DashHeader = () => {
    const { pathname } = useLocation();
	const { logout } = useAuth();
	const [isSuccessLogout, setIsSuccessLogout] = useState(false);
	const [isLogoutLoading, setIsLogoutLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();
	
	const {isManager, isAdmin} = useAuthRoles()

	useEffect(()=>{
		if(isSuccessLogout){
			navigate('/', {replace: true});		
		}
	}, [isSuccessLogout])

	const handleOnLogout = async () => {
		try{
			setIsLogoutLoading(true);
			// await new Promise(resolve => setTimeout(resolve, 2000));
			const response = await logout();
			if(response.status == 204){
				console.log("the cookie was already removed")
			}
			else{
				console.log(response.data.message);
			}
			setIsSuccessLogout(true);
			setIsError(false);
			setError(null);
		}
		catch(err){
			setIsSuccessLogout(false);
			setIsError(true);
			setError(e);
		}
		finally{
			setIsLogoutLoading(false);
		}
	}

	const seeUsersButton = ((isManager || isAdmin) && (pathname == '/dashboard' || pathname == '/dashboard/notes')) ? <button onClick={()=>navigate('/dashboard/users')}>Users</button> : null;
	const addUserButton = ((isManager || isAdmin) && pathname == '/dashboard/users')  ? <button onClick={()=>navigate('/dashboard/users/new')}>Add User</button> : null;

	const seeNotesButton = (pathname == '/dashboard' || pathname == '/dashboard/users') ? <button onClick={()=>navigate('/dashboard/notes')}>Notes</button> : null;
	const addNoteButton = (pathname == '/dashboard/notes') ? <button onClick={()=>navigate('/dashboard/notes/new')}>Add Note</button> : null;
	const logoutButton = <button onClick={handleOnLogout}>Logout</button>

	const buttons = (!isLogoutLoading) ? (
						<>
							{seeUsersButton}
							{addUserButton}
							{seeNotesButton}
							{addNoteButton}
							{logoutButton}
						</>
					) : <p>Logging out...</p>;

	const errorCSS = (isError)?"errorMessage" : "noErrorMessage";
	return (
		<>
			<p className={errorCSS}>{JSON.stringify(error)}</p>
			<header style={{ border: '1px solid grey', display: 'flex', alignItems: "center", justifyContent: "space-evenly" }}>
				<h2>
					<Link to="/dashboard">Company's Logo</Link>
				</h2>
				<nav>
					{buttons}
				</nav>
			</header>
		</>
	);
};

export default DashHeader;
