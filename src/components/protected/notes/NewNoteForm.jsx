import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const NewNoteForm = ({ users }) => {
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [userId, setUserId] = useState(users[0]._id);
    
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();
    const secondTime = useRef(false);
    const axiosPrivate = useAxiosPrivate()

    useEffect(()=>{
        return () => {
            secondTime.current = true;
        }
    }, []);

	useEffect(() => {
		if (isSuccess) {
			setTitle('');
			setText('');
			setUserId('');
			navigate('/dashboard/notes');
		}
	}, [isSuccess, navigate]);

	let canSave = [title, text, userId].every(Boolean) && !isLoading;

	const handleOnSubmit = async (e) => {
		e.preventDefault();
        let isMounted = true;
        const controller = new AbortController();

		if (canSave && secondTime.current == true) {
			try {
				setIsLoading(true);
				const postObject = { user: userId, title, text };
				const response = await axiosPrivate.post(
					'http://localhost:3500/notes',
					postObject,
					{ signal: controller.signal}
				);
				console.log(response.data);
                if(isMounted){
                    setIsError(false);
                    setError(null);
                    setIsSuccess(true);
                }
			} catch (e) {
				console.error(e);
                if(e?.response?.status == 403){
					navigate('/login', {
						state: { from: location },
						replace: true,
					});
				}
                if(isMounted){
                    setIsSuccess(false);
                    setIsError(true);
                    setError(e.message);
                }
			} finally {
                if(isMounted){
                    setIsLoading(false);
                }
			}
		}
	};


	return (
		<>
			<p>{error?.data?.message}</p>

			<form onSubmit={handleOnSubmit}>
				<div>
					<div>New Note</div>
					<button type="submit" disabled={!canSave}>
						Save
					</button>
				</div>

				<div>
					<label htmlFor="title">Title:</label>
					<input
						type="text"
						id="title"
						name="title"
						autoComplete="off"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="text">Text:</label>
					<textarea
						id="text"
						name="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="assignedto">ASSIGNED TO:</label>
					<select
						id="assignedto"
						name="assignedto"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
					>
						{users.map((user, index) => {
							return (
								<option key={index} value={user._id}>
									{user.username}
								</option>
							);
						})}
					</select>
				</div>
			</form>
		</>
	);
};

export default NewNoteForm;
