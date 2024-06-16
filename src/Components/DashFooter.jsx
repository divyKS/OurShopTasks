import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthRoles from '../Hooks/useAuth'

const DashFooter = () => {
  
  const {pathname} = useLocation()
  const {status, username} = useAuthRoles();

  return (
    <footer style={{border: "1px solid grey"}}>
      
      <p>Current User: {username}</p>
      <p>Current Status: {status}</p>
      { pathname !== '/dashboard'? <p><Link to='/dashboard'>let's do to dashboard</Link></p> : <p>you're on dashboard</p> }
        
    </footer>
  )
}

export default DashFooter