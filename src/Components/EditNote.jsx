import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditNoteForm from './EditNoteForm';

const EditNote = () => {
    const {noteID} = useParams();
    // can not put this state of object to be {} keep it null
    const [note, setNote] = useState(null)
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        const getNote = async () => {
            try{
                const response = await axios.get(`http://localhost:3500/notes/${noteID}`);
                // console.log(response);
                setNote(response.data);
                console.log(note);
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
                const response = await axios.get(`http://localhost:3500/users`);
                // console.log(response);
                setUsers(response.data);
                console.log(users)
            }
            catch(e){
                console.error(e);
            }
            finally{

            }
        };
    
        getUsers();
    }, [note]);



	return (
        <>
            {(note && users) ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>}
            {/* {(note && users) ? <div>{JSON.stringify(note)}</div> : <p>Loading...</p>} */}
        </>
    );
};

export default EditNote;
