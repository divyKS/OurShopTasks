import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

const DashHeader = () => {
	const [isSuccessLogout, setIsSuccessLogout] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const logout = useLogout();

	useEffect(() => {
		if (isSuccessLogout) {
			navigate('/', { replace: true });
		}
	}, [isSuccessLogout]);

	const handleOnLogout = async () => {
		try {
			const response = await logout();
			if (response.status == 204) {
				console.log('the cookie was already removed');
			} else {
				console.log(response.data.message);
			}
			setIsSuccessLogout(true);
			setIsError(false);
			setError(null);
		} catch (err) {
			setIsSuccessLogout(false);
			setIsError(true);
			setError(e);
		} finally {
		}
	};

	const errorCSS = isError ? 'errorMessage' : 'noErrorMessage';

	return (
		<>
			<p className={errorCSS}>{JSON.stringify(error)}</p>
			<header
				style={{
					border: '1px solid grey',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-evenly',
				}}
			>
				<h2>
					<Link to="/dashboard">Company's Logo</Link>
				</h2>
				<nav>
					<button onClick={handleOnLogout}>Logout</button>
				</nav>
			</header>
		</>
	);
};

export default DashHeader;
