import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../Context/AuthContext';

import AuthContext from '../Context/AuthProvider';
import axios from '../config/myaxios';

const Login = () => {
	const userRef = useRef(); // to set focus to enter credentials // const errRef = useRef(); // to set focus to error message if there is some error for screen readers

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	// const { login }  = useAuth();

	const from = location?.state?.from?.pathname || '/dashboard';

	const { setAuth } = useContext(AuthContext);

	useEffect(() => {
		// when the component loads for the first time, just for that
		userRef.current?.focus();
	}, []);

	useEffect(() => {
		// the user after seeing message changes the username etc. so remove the error message
		setErrMsg('');
	}, [username, password]);

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			// const response = await login({username, password});
			// console.log(response);
			const response = await axios.post(
				'/auth',
				{ username, password },
				{ withCredentials: true }
			);
			// console.log(response.data);
			setAuth({
				user: username,
				pwd: password,
				roles: response.data.roles,
				accessToken: response.data.accessToken,
			});
			setUsername('');
			setPassword('');
			// console.log(location) nested kind of object which has state and then everything inside of the previous call
			// const from = location.state?.from?.pathname || '/dashboard';
			// navigate(from, {replace: true});
			navigate(from, { replace: true });
		} catch (err) {
			if (!err.response.status) {
				setErrMsg('No Server Response');
			} else if (err.response.status === 429) {
				console.log(err.response);
				setErrMsg(err.response.data.message);
			} else if (err.response.status === 400) {
				setErrMsg('Missing Username or Password');
			} else if (err.response.status === 401) {
				setErrMsg(
					'Unauthorized, username incorrect, or both incorrect'
				);
			} else {
				setErrMsg(err.response.message);
			}
			// errRef.current.focus(s); // and putting aria-live="assertive" in the para so that i can be read by screen readers
		} finally {
			setIsLoading(false);
		}
	};

	const errorCSS = errMsg ? 'errorMessage' : 'noErrorMessage';

	if (isLoading) {
		return (
			<>
				<p style={{ display: 'grid', alignItems: 'center' }}>
					Signing you in...
				</p>
			</>
		);
	} else {
		return (
			<>
				<section className="loginForm">
					<header>
						<h2>Employee Login</h2>
					</header>
					<main>
						<p className={errorCSS}>{errMsg}</p>

						<form className="newUserForm" onSubmit={handleOnSubmit}>
							<div className="newUserFormContent">
								<label htmlFor="username">Username:</label>
								<input
									id="username"
									type="text"
									ref={userRef}
									autoComplete="off"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									required
								/>
							</div>

							<div className="newUserFormContent">
								<label htmlFor="password">Password:</label>
								<input
									id="password"
									type="password"
									autoComplete="off"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
							<div className="loginButton">
								<button type="submit">Login</button>
							</div>
						</form>
						{/* <div>you'll login somewhere here</div> */}
					</main>
					<footer>
						<Link to="/">Home</Link>
					</footer>
				</section>
			</>
		);
	}
};

export default Login;
