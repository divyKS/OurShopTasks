import './App.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Public from './Components/Public';
import Login from './Components/Login';
import DashLayout from './Components/DashLayout';
import NotesList from './Components/NotesList';
import UsersList from './Components/UsersList';
import Welcome from './Components/Welcome';
import EditUser from './Components/EditUser';
import NewUserForm from './Components/NewUserForm';
import EditNote from './Components/EditNote';
import NewNote from './Components/NewNote';
import RequireAuth from './Components/RequireAuth';
import { ROLES } from './config/roles';
import Unauthorized from './Components/Unauthorized';


const myRouter = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<Public />} />
			<Route path="/login" element={<Login />} />
			<Route path="/unauthorized" element={<Unauthorized/>} />			
			<Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
				<Route path="/dashboard" element={<DashLayout />}>					
					<Route index element={<Welcome />} />					
					<Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]}/>}>
						<Route path="users">
							<Route index element={<UsersList />} />							
							<Route path=":userID" element={<EditUser />} />							
							<Route path="new" element={<NewUserForm />} />
						</Route>
					</Route>				
					<Route path="notes">                    
						<Route index element={<NotesList />} />
						<Route path=':noteID' element={<EditNote />} />
						<Route path='new' element={<NewNote />} />
					</Route> 
				</Route>
			</Route>
		</>
	)
);

function App() {
	return (
		<>
			<RouterProvider router={myRouter} />
		</>
	);
}

export default App;
