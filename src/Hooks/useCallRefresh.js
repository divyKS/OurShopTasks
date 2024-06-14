import axios from 'axios';
import { useEffect, useState } from 'react';

function useCallRefresh() {
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState(null);

	const getNewAccessToken = async () => {
		let isMounted = true;
		const source = axios.CancelToken.source();

		try {
			const axiosConfigObject = { cancelToken: source.token, withCredentials: true };
			const response = await axios.get('http://localhost:3500/auth/refresh', axiosConfigObject);
			if (isMounted) {
				setIsError(null);
				setError(null);
				return response.data.accessToken;
			}
		} catch (e) {
			if (isMounted) {
				if (e.response.status == 403) {
					console.log('your refresh token inside the cookie has also expired, you have to login again now');
				}
				setIsError(true);
				setError(e);
			}
		} 

		const cleanUp = () => {
			if (isMounted) {
				isMounted = false;
				source.cancel();
			}
		};

		return cleanUp;

	}

	return { getNewAccessToken, isError, error };
}

export default useCallRefresh;
