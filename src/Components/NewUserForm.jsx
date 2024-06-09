// will not be a public form
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES }from '../config/roles.js';
import axios from "axios";
import {useAuth} from '../Context/AuthContext.jsx';

const USER_REGEX = new RegExp("^[A-z ]{3,20}$")
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/ 

const NewUserForm = () => {
    // isSuccess - state - to navigate back to the /users page
    // isError, error - states - to display error message on top of form inside a paragraph, to style classes
    // isLoading - state to allow saving of new employee

    // addNewUser - function - to make db call with username, password, roles

	const navigate = useNavigate();
    const { authToken: accessToken } = useAuth();

	const [username, setUsername] = useState('');
	const [validUsername, setValidUsername] = useState(false);
	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(['Employee']);

    // these for the post request, since i am not using redux, so can have that useAddNewMutation() and getting access to those states only when that function is called
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);
    
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if(canSave && isSuccess){
            setUsername("");
            setPassword("");
            setRoles([]);
            navigate('/dashboard/users', {replace: true});
        }
    } ,[isSuccess, navigate]);


    const handleOnRoleChange = (e) => {
        // console.log(Array.from(e.target.selectedOptions))
        // console.log(e)
        // const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value)
        const selectedValues = [...e.target.selectedOptions].map(option => option.value)
        setRoles(selectedValues);
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if(canSave){
            try{
                setIsLoading(true);
                const postObject = { username, password, roles };
                const response = await axios.post('http://localhost:3500/users', postObject, { headers: { Authorization: `Bearer ${accessToken}` }});
                setIsError(false);
                setError(null);
                setIsSuccess(true);
            }
            catch(error){
                setIsError(true);
                setError(error.message);
            }
            finally{
                setIsLoading(false);
            }
        }

    }

    const errorCSS = isError ? "errorMessage" : "noErrorMessage"; // error to offscreen or visible is isError
    const canSave = roles.length && validUsername && validPassword && !isLoading; // isLoading, is majorly so that we can navigate to users if we have successfully saved the user

	return (
        <>
            <p className={errorCSS}>{error}</p>
            <form onSubmit={handleOnSubmit} className='newUserForm'>
                <div className='newUserFormHeading'>
                    <div>Create New User</div>
                    <button type='submit' disabled={!canSave}>Save</button>
                </div>
                <div className='newUserFormContent'>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        autoComplete="off"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </div>
                <div className='newUserFormContent'>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="off"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                <div className='newUserFormContent'>
                    <label htmlFor="roles">Assigned Roles:</label>
                    <select
                        name="roles"
                        id="roles"
                        size={3}
                        multiple
                        value={roles}
                        onChange={handleOnRoleChange}
                    >
                        {Object.values(ROLES).map( role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                
            </form>
        </>
    );
};

export default NewUserForm;
