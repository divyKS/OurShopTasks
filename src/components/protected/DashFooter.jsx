import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const DashFooter = () => {
    const {username, status} = useAuth();
    const {pathname} = useLocation()
	return (
		<footer style={{ border: '1px solid grey', padding: '0.5rem' }}>
			<p>Current User: {username}</p>
			<p>Current Status: {status}</p>
            { pathname !== '/dashboard' && <p><Link to='/dashboard'>let's do to dashboard</Link></p>}
		</footer>
	);
};

export default DashFooter;
