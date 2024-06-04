import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditUserForm from './EditUserForm';


// SETUP THE ERROR SCREEN instead of just loading


const EditUser = () => {
	const { userID } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try{
                const response = await axios.get(`http://localhost:3500/users/${userID}`);
                // console.log(response);
                setUser(response.data);
            }
            catch(e){
                console.error(e);
            }
            finally{

            }
        };
    
        getUser();
    }, [userID]);
    

	return (
        <>
            {user ?  <EditUserForm user={user} /> : <p>Loading...</p>}
        </>
    );
};

export default EditUser;