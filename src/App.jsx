import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';

import Public from './components/public/Public';
import Login from './components/public/Login';
import Unauthorized from './components/auth/Unauthorized.jsx';
import RequireAuth from './components/auth/RequireAuth.jsx';
import DashLayout from './components/protected/DashLayout';
import DashContent from './components/protected/DashContent';
import UsersList from './components/protected/users/UsersList.jsx';
import NotesList from './components/protected/notes/NotesList.jsx';
import ROLES  from './config/roles.js';
import PersistLogin from './components/auth/PersistLogin.jsx';
import Missing from './components/public/Missing.jsx';
import EditUser from './components/protected/users/EditUser.jsx';
import NewUserForm from './components/protected/users/NewUserForm.jsx';
import EditNote from './components/protected/notes/EditNote.jsx';
import NewNote from './components/protected/notes/NewNote.jsx';

const myRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Public />}/>
            
            <Route path="/login" element={<Login />} />
            
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route element={<PersistLogin />} >
                
                <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />} >
                
                    <Route path="/dashboard" element={<DashLayout />} >
                        
                        <Route index element={<DashContent />} />
                        


                        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]}/>} >
                            <Route path="users">
                                <Route index element={<UsersList />} />
                                <Route path=":userID" element={<EditUser />} />
                                <Route path="new" element={<NewUserForm />} />
                            </Route>
                        </Route>



                        <Route path="notes">
                            <Route index element={<NotesList />} />
                            <Route path=":noteID" element={<EditNote />} />
                            <Route path="new" element={<NewNote />} />
                        </Route>

                    </Route>
                </Route>
            </Route>

            <Route path='/*' element={<Missing />} />

        </>
    )
);

function App() {
	return <RouterProvider router={myRouter} />;
}
export default App;
