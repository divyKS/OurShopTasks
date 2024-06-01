import React from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
  const today = Intl.DateTimeFormat('hi', {dateStyle:'full', timeStyle:'full'}).format(new Date())
  return (
    <>
      <p>This is your dashboards' welcome page after login</p>
      <p>{today}</p>
      <p><Link to='notes'>view notes</Link></p>
      <p><Link to='notes/new'>add new node</Link></p>
      <p><Link to='users'>view user settings</Link></p>
      <p><Link to='users/new'>add new user</Link></p>
    </>
  )
}

export default Welcome