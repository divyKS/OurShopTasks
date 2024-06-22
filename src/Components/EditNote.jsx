import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditNoteForm from './EditNoteForm';
import {useAuth} from '../Context/AuthContext.jsx';
import useAuthRoles from '../Hooks/useAuth.js';
 
const EditNote = () => {
    const {noteID} = useParams();
    // can not put this state of object to be {} keep it null
    const [note, setNote] = useState(null)
    const [users, setUsers] = useState([])
    const [noteOwner, setNoteOwner] = useState(null)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const { authToken: accessToken } = useAuth();

    const { username, isManager, isAdmin } = useAuthRoles();
    
    useEffect(() => {
        const getNote = async () => {
            try{
                const response = await axios.get(`http://localhost:3500/notes/${noteID}`, { headers: { Authorization: `Bearer ${accessToken}`}});
                // console.log(response);
                setNote(response.data);
            }
            catch(e){
                console.error(e);
            }
            finally{

            }
        };
    
        getNote();
    }, [noteID]);

    // just fetching it after getting the note data from server
    useEffect(() => {
        const getUsers = async () => {
            try{
                const response = await axios.get(`http://localhost:3500/users`, { headers: { Authorization: `Bearer ${accessToken}` }});
                // console.log(response);
                setUsers(response.data);
                // console.log(users)
            }
            catch(e){
                console.error(e);
            }
            finally{

            }
        };
    
        getUsers();
    }, [note]);

    useEffect(()=>{
        if(note && users){

            const getOwnerOfNote = async () => {
                try {
                    const response = await axios.get(`http://localhost:3500/users/${note.user}`, {headers: {Authorization: `Bearer ${accessToken}`}});
                    setNoteOwner(response.data.username);
                    setIsError(false);
                    setError(null);
                } catch (e) {
                    setIsError(true);
                    setError(e);
                }
            }

            getOwnerOfNote();
        }
    }, [note, users])

    // !TODO Check this after AT persists
    if((!isAdmin && !isManager) && noteOwner !== username){
        return (<p>No access</p>)
    }
    else{
        return (
            <>
                {(note && users)
                    ? <EditNoteForm note={note} users={users}/> 
                    : <p>Loading...</p>
                }
                {/* {(note && users) ? <div>{JSON.stringify(note)}</div> : <p>Loading...</p>} */}
            </>
        );
    }
};

export default EditNote;
