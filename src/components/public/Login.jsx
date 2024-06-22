import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/myaxios';
import useLocalStorage from '../../hooks/useLocalStorage';

const Login = () => {
	// const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const userRef = useRef();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location?.state?.from?.pathname || '/dashboard';

	const { setAuth, persist, setPersist } = useAuth();
	const [username, setUsername] = useLocalStorage('user', '');

	useEffect(() => {
		userRef.current?.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [username, password]);

	useEffect(() => {
		localStorage.setItem("persist", JSON.stringify(persist));
	}, [persist]);

	const togglePersist = () => {
		setPersist(prev => !prev);
	}

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const response = await axios.post(
				'/auth',
				{ username, password },
				{ withCredentials: true }
			);
			setAuth({ accessToken: response?.data?.accessToken });
			setUsername('');
			setPassword('');
			navigate(from, { replace: true });
		} catch (err) {
			if (!err?.response) {
				setErrMsg('No Server Response');
			} else if (err.response.status === 429) {
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
		} finally {
			setIsLoading(false);
		}
	};

	const errorCSS = errMsg ? 'errorMessage' : 'noErrorMessage';

	if (isLoading) {
		return (
			<p style={{ display: 'grid', alignItems: 'center' }}>
				Signing you in...
			</p>
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

						<form className="" onSubmit={handleOnSubmit}>
							<div className="">
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

							<div className="">
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
							<div className="">
								<label htmlFor="persist">Trust This Device</label>
								<input
									type="checkbox"
									id="persist"
									onChange={togglePersist}
									checked={persist}
								/>
							</div>
								<div className="">
								<button type="submit">Login</button>
							</div>
						</form>
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
