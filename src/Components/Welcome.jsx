import React from 'react'
import { Link } from 'react-router-dom'
import useAuthRoles from '../Hooks/useAuth'
import useTitle from '../Hooks/useTitle'

const Welcome = () => {
  useTitle("LALA Dashboard");
  const today = Intl.DateTimeFormat('hi', {dateStyle:'full', timeStyle:'full'}).format(new Date())
  const { username, isManager, isAdmin } = useAuthRoles()
  return (
    <>
      <p>Welcome {username}</p>
      <p>This is your dashboards' welcome page.</p>
      <p>{today}</p>
      <p><Link to='notes'>view notes</Link></p>
      <p><Link to='notes/new'>add new node</Link></p>
      {(isManager || isAdmin) && <p><Link to='users'>view user settings</Link></p>}
      {(isManager || isAdmin) && <p><Link to='users/new'>add new user</Link></p>}
      {/* <p><Link to='users'>view user settings</Link></p>
      <p><Link to='users/new'>add new user</Link></p> */}
    </>
  )
}

export default Welcome