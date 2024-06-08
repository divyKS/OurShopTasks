import axios from 'axios';
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState('');

    const login = async ({ username, password }) => {
        try{
            const postObject = { username, password };
            // without the credentials here the cookie would not set
            const response = await axios.post('http://localhost:3500/auth', postObject, {withCredentials: true, credentials: 'include'});
            setAuthToken(response.data.accessToken);
            return response;
        }
        catch(err){
            throw err; // to be handled by the calling place
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:3500/auth/logout', {}, { withCredentials: true });
            setAuthToken('');
            return response;
        } catch (err) {
            // console.error('Error during logout:', error);
            return err;
        }
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
