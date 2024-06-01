// !TODO: classnames have been kept same in the form like the new user form
// !TODO: how to have the save option available only if some chanes have been done, something to do with cansave

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ROLES }from '../config/roles.js';
import axios from "axios";

const USER_REGEX = new RegExp("^[A-z ]{3,20}$")
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/ 

// username, password, roles[], active, _id {user}
const EditUserForm = ({ user }) => {
	// isSuccess - state - to navigate back to the /users page
    // isError, error - states - to display error message on top of form inside a paragraph, to style classes
    // isLoading - state to allow saving of new employee

    // addNewUser - function - to make db call with username, password, roles

	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [validUsername, setValidUsername] = useState(false);
	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(["Employee"]);
    const [active, setActive] = useState(true)

    // these for the post request, since i am not using redux, so can have that useAddNewMutation() and getting access to those states only when that function is called
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
    const [isUpdateError, setIsUpdateError] = useState(false);
    const [uptError, setUptError] = useState(null);
	
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isDelSuccess, setIsDelSuccess] = useState(false);
	const [isDelError, setIsDelError] = useState(false);
    const [delError, setDelError] = useState(null);

	useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setRoles(user.roles || []);
            setActive(user.active || true);
        }
    }, [user]);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);
    
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
		// canSave condition removed
        if(isUpdateSuccess || isDelSuccess){
            setUsername("");
            setPassword("");
            setRoles([]);
            navigate('/dashboard/users', {replace: true});
        }
    } ,[isUpdateSuccess, isDelSuccess, navigate]);

    const handleOnRoleChange = (e) => {
        // console.log(Array.from(e.target.selectedOptions))
        // console.log(e)
        // const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value)
        const selectedValues = [...e.target.selectedOptions].map(option => option.value)
        setRoles(selectedValues);
    }
	
	const handleActiveChange = (e) => {
		setActive((prevActive)=>!prevActive);
	}

    const handleOnSubmit = async (e) => {
        e.preventDefault();
		// removing canSave, using canSave to just handle to button disabled or enabled of updates
		let patchObject = {};
		
		if(password){
			patchObject = {id: user._id, username, roles, active, password};			
		}
		else{
			patchObject = {id: user._id, username, roles, active};
		}

		try{
			setIsUpdateLoading(true);
			const response = await axios.patch('http://localhost:3500/users', patchObject);
			console.log("updated user data - " + JSON.stringify(response.data));
			setIsUpdateError(false);
			setUptError(null);
			setIsUpdateSuccess(true);
		}
		catch(error){
			setIsUpdateError(true);
			setUptError(error.message);
		}
		finally{
			setIsUpdateLoading(false);
		}
    }

	
	const handleOnDelete = async (e) => {
		e.preventDefault();
		
		try{
			setIsDeleteLoading(true);
			const response = await axios.delete('http://localhost:3500/users/',
				{data: {"id": user._id}
			});
			console.log("deleted user data - " + JSON.stringify(response.data));
			setIsDelError(false);
			setDelError(null);
			setIsDelSuccess(true);
		}
		catch(error){
			setIsDelError(true);
			setDelError(error.message);
		}
		finally{
			setIsDeleteLoading(false);
		}
    }


    const errorCSS = (isDelError || isUpdateError) ? "errorMessage" : "noErrorMessage"; // error to offscreen or visible is isError
    const canSave = password? roles?.length && validUsername && validPassword && !isUpdateLoading : roles?.length && validUsername && !isUpdateLoading; // isLoading, is majorly so that we can navigate to users if we have successfully saved the user

	return (
        <>
            <p className={errorCSS}>{uptError || delError}</p>

            <form onSubmit={e => e.preventDefault()} className='newUserForm'>

                <div className='newUserFormHeading'>
                    <div>Update User {user.username}</div>
                    <button disabled={!canSave} onClick={handleOnSubmit}>Update</button>
                    <button onClick={handleOnDelete}>Delete</button>
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
                
				<div className='newUserFormContent' style={{}}>
					<label htmlFor="active">Active:</label>
					<input
						type="checkbox"
						id="active"
						name="active"
						checked={active}
						onChange={handleActiveChange}
					/>
				</div>

            </form>
        </>
    );
}

export default EditUserForm