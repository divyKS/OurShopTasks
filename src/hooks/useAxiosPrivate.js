import { useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';
import { axiosPrivate } from '../api/myaxios';

const useAxiosPrivate = () => {
	const { auth } = useAuth();
	const refresh = useRefreshToken();

	useEffect(() => {
		const requestInterceptor = axiosPrivate.interceptors.request.use(
			function (config) {
				if (!config.headers['Authorization']) {
					config.headers[
						'Authorization'
					] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			function (err) {
				return Promise.reject(err);
			}
		);

		const responseInterceptor = axiosPrivate.interceptors.response.use(
			function (response) {
				return response;
			},
			async function (err) {
				const prevReq = err.config;
				if (!prevReq.sent && err.response?.status == 403) {
					prevReq.sent = true; // adding this property from our side
					prevReq.withCredentials = true;
					const newAccessToken = await refresh();
					prevReq.headers[
						'Authorization'
					] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevReq);
				}
				return Promise.reject(err);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestInterceptor);
			axiosPrivate.interceptors.response.eject(responseInterceptor);
		};
        // cleanup runs when the component using this hook unmounts
	}, [auth, refresh]);

	// this hook is to set the interceptors (middlewares to) in the axiosPrivate instance that we had created
	// it now returns the axiosPrivate instance with interceptors attached
	return axiosPrivate;
};

export default useAxiosPrivate;
