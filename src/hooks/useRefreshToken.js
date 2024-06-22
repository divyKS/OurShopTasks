import axios from '../api/myaxios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {withCredentials: true});
        setAuth(prevAT => ({accessToken: response.data.accessToken}));
        return response.data.accessToken;
    }

    return refresh;
};

export default useRefreshToken;