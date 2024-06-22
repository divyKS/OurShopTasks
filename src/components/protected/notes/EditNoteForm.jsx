import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useEffect, useRef, useState } from 'react';

const EditNoteForm = ({ note, users }) => {
	const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [completed, setCompleted] = useState(false);
    const [userId, setUserId] = useState('');

    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
    const [isUpdateError, setIsUpdateError] = useState(false);
    const [uptError, setUptError] = useState(null);
	
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isDelSuccess, setIsDelSuccess] = useState(false);
	const [isDelError, setIsDelError] = useState(false);
    const [delError, setDelError] = useState(null);

    const navigate = useNavigate()
    const {isManger, isAdmin} = useAuth();
	const axiosPrivate = useAxiosPrivate();    
    
    const secondTime = useRef(false);
    
    useEffect(()=>{
        return () => {
            secondTime.current = true;
        }
    }, []);

    useEffect(() => {
        if(note){
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

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let isMounted = true;
        const controller = new AbortController();

        if (canSave && secondTime.current == true) {
            console.log("old user - " + note.user);
            console.log("new user - " + userId);
            let patchObject = {id: note._id, user: userId, title, text, completed};

            try{
                setIsUpdateLoading(true);
                const response = await axiosPrivate.patch('/notes', patchObject, {signal: controller.signal});
                console.log("updated note data - " + JSON.stringify(response.data));
                if(isMounted){
                    setIsUpdateError(false);
                    setUptError(null);
                    setIsUpdateSuccess(true);
                }
            }
            catch(error){
                console.log(error)
                if(error?.response?.status == 403){
                    navigate('/login', {
                        state: { from: location },
						replace: true,
					});
				}
                if(isMounted){
                    setIsUpdateError(true);
                    setUptError(error.message);
                }
            }
            finally{
                if(isMounted){
                    setIsUpdateLoading(false);
                }
            }
        }

		return () => {
			isMounted = false;
			secondTime.current = true;
			controller.abort();
		};

    }

    const handleOnDelete = async (e) => {
        e.preventDefault();
        let isMounted = true;
        const controller = new AbortController();

        try{
			setIsDeleteLoading(true);
			const response = await axiosPrivate.delete('http://localhost:3500/notes/',
				{  
                    signal: controller.signal,
                    data: {
                        "id": note._id
                    }
                });
			console.log("deleted user data - " + JSON.stringify(response.data));
            if(isMounted){
                setIsDelError(false);
                setDelError(null);
                setIsDelSuccess(true);
            }
		}
		catch(error){
            if(error?.response?.status == 403){
                navigate('/login', {
                    state: { from: location },
                    replace: true,
                });
            }
            if(isMounted){
                setIsDelError(true);
                setDelError(error.message);
            }
		}
		finally{
            if(isMounted){
                setIsDeleteLoading(false);
            }
		}

        return () => {
			isMounted = false;
			secondTime.current = true;
			controller.abort();
		};
    }

    const canSave = [title, text, userId].every(Boolean) && !(isUpdateLoading||isDeleteLoading);
    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

	return (
		<>
			<p>{uptError || delError}</p>

			<form onSubmit={(e) => e.preventDefault()}>
				<div>
					<h2>Edit Note #{note.ticket}</h2>
					<button onClick={handleOnSubmit} disabled={!canSave}>
						Update
					</button>
					{(isManger || isAdmin) && (
						<button onClick={handleOnDelete}>Delete</button>
					)}
				</div>

				<div>
					<label htmlFor="note-title">Title:</label>
					<input
						id="note-title"
						name="title"
						type="text"
						autoComplete="off"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="note-text">Text:</label>
					<textarea
						id="note-text"
						name="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="note-completed">Completed:</label>
					<input
						id="note-completed"
						name="completed"
						type="checkbox"
						checked={completed}
						onChange={handleOnCompleteChange}
					/>
				</div>

				<div>
					<label htmlFor="note-username">Assigned To:</label>
					<select
						id="note-username"
						name="username"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
					>
						{users.map((user, index) => {
							return (
								<option key={index} value={user._id}>
									{' '}
									{user.username}
								</option>
							);
						})}
					</select>
				</div>

				<div>
					<p>Created: {created}</p>
					<p>Updated: {updated}</p>
				</div>
			</form>
		</>
	);
};

export default EditNoteForm;
