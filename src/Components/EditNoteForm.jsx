import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditNoteForm = ({ note, users }) => {
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
    const [isUpdateError, setIsUpdateError] = useState(false);
    const [uptError, setUptError] = useState(null);
	
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isDelSuccess, setIsDelSuccess] = useState(false);
	const [isDelError, setIsDelError] = useState(false);
    const [delError, setDelError] = useState(null);

    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [completed, setCompleted] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        // note = {} will pass, but it has no properties, hence undefined
        if(note){
            // the values of these states were becoming undefined even though these are controlled inputs i.e. the input tags values are from a state title, text etc., when this happens they no longer remain controlled, 
            setTitle(note.title);
            setText(note.text);
            setCompleted(note.completed);
            setUserId(note.user);
        }
    }, [note])

    useEffect(() => {
        if (isUpdateSuccess || isDelSuccess) {
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dashboard/notes', {replace: true});
        }
    }, [isUpdateSuccess, isDelSuccess, navigate])

    const handleOnCompleteChange = (e) => {
        setCompleted(prev => !prev);
    };

    const canSave = [title, text, userId].every(Boolean) && !(isUpdateLoading||isDeleteLoading);

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (canSave) {
            console.log("old user - " + note.user);
            console.log("new user - " + userId);
            let patchObject = {id: note._id, user: userId, title, text, completed};
		
            try{
                setIsUpdateLoading(true);
                const response = await axios.patch('http://localhost:3500/notes', patchObject);
                console.log("updated note data - " + JSON.stringify(response.data));
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
    }

    const handleOnDelete = async (e) => {
        e.preventDefault();
        try{
			setIsDeleteLoading(true);
			const response = await axios.delete('http://localhost:3500/notes/',
				{data: {"id": note._id}, 
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

    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const errorCSS = (isUpdateError || isDelError) ? "errorMessage" : "noErrorMessage";

	return (
        <>
            <p className={errorCSS}>{uptError || delError}</p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>

                <div className="newUserFormHeading">
                    <h2>Edit Note #{note.ticket}</h2>
                    <button onClick={handleOnSubmit} disabled={!canSave}>Update</button>
                    <button onClick={handleOnDelete}>Delete</button>
                </div>

                <div className='newUserFormContent'>
                    <label htmlFor="note-title">Title:</label>
                    <input
                        id="note-title"
                        name="title"
                        type="text"
                        autoComplete="off"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                    />
                </div>

                <div className='newUserFormContent'>
                    <label htmlFor="note-text">Text:</label>
                    <textarea
                        id="note-text"
                        name="text"
                        value={text}
                        onChange={(e)=>setText(e.target.value)}
                    />
                </div>

                
                <div className="newUserFormContent">
                    <label htmlFor="note-completed">Completed:</label>
                    <input
                        id="note-completed"
                        name="completed"
                        type="checkbox"
                        checked={completed}
                        onChange={handleOnCompleteChange}
                    />
                </div>

                <div className="newUserFormContent">
                    <label htmlFor="note-username">Assigned To:</label>
                    <select
                        id="note-username"
                        name="username"
                        value={userId}
                        onChange={(e)=>setUserId(e.target.value)}
                    >
                        {
                            users.map(user => {
                                return (
                                    <option
                                        key={user._id}
                                        value={user._id}

                                    > {user.username}</option >
                                )
                            })
                        }
                    </select>
                </div>


                    <div style={{"fontSize": '0.7rem'}}>
                        <p>Created: {created}</p>
                        <p>Updated: {updated}</p>
                    </div>
                


            </form>
        </>
    );
};

export default EditNoteForm;
