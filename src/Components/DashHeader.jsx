import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'
const DashHeader = () => {
    const { pathname } = useLocation();
	const { logout } = useAuth();
	const [isSuccessLogout, setIsSuccessLogout] = useState(false);
	const navigate = useNavigate();

	useEffect(()=>{
		if(isSuccessLogout){
			navigate('/', {replace: true});		
		}
	}, [isSuccessLogout])

	const handleOnLogout = async () => {
		try{
			const response = await logout();
			if(response.status == 204){
				console.log("the cookie was already removed")
			}
			else{
				console.log(response.data.message);
			}
			setIsSuccessLogout(true);
		}
		catch(err){
			setIsSuccessLogout(false);
			console.log(err)
		}
	}

	return (
		<header style={{ border: '1px solid grey', display: 'flex', alignItems: "center", justifyContent: "space-evenly" }}>
			<h2>
				<Link to="/dashboard">Company's Logo</Link>
			</h2>
			<nav>
				<button onClick={handleOnLogout}>Logout</button>
			</nav>
		</header>
	);
};

export default DashHeader;
