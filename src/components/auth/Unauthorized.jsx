import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
	const navigate = useNavigate();

	return (
		<>
			<div>Sorry, you're unauthorized to access this resource</div>
			<button onClick={() => navigate(-1)}>
				let's go back
			</button>
		</>
	);
};

export default Unauthorized;
