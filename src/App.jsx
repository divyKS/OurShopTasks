import './App.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Public from './Components/Public'
import Login from './Components/Login'
import DashLayout from './Components/DashLayout'
import NotesList from './Components/NotesList'
import UsersList from './Components/UsersList'
import Welcome from './Components/Welcome'


const myRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Public/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<DashLayout/>}>
        <Route index element={<Welcome/>}/>
        <Route path='notes' element={<NotesList/>}/>
        <Route path='users' element={<UsersList/>}/>
      </Route>
    </>
  )
)


function App() {

  return (
    <> 
      <RouterProvider router={myRouter} />
    </>
  )
}

export default App
