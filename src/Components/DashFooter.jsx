import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const DashFooter = () => {
  
  const {pathname} = useLocation()

  return (
    <footer style={{border: "1px solid grey"}}>
      
      <h2>dashboard footer</h2>
      <p>Current User:</p>
      <p>Current Status:</p>
      <p>This current url will be used to display a home button to dashboard: {pathname}</p>
      {pathname !== '/dashboard'? 
        <p>
          <Link to='/dashboard'>BACK</Link>
        </p>
        :
        <></>
      }
        
    </footer>
  )
}

export default DashFooter