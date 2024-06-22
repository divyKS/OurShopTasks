import axios from '../api/myaxios';
import useAuth from './useAuth';

const useLogout = () => {
	const { setAuth } = useAuth();

	const logout = async () => {
		setAuth({});
		try {
			const response = await axios.post(
				'/auth/logout',
				{},
				{ withCredentials: true }
			);
			return response;
		} catch (err) {
			throw err;
		}
	};
	
	return logout;
};

export default useLogout;
