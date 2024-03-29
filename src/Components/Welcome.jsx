import React from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
  return (
    <>
      <p>This is your dashboards' welcome page after login</p>
      <p><Link to='notes'>view notes</Link></p>
      <p><Link to='users'>view user settings</Link></p>
    </>
  )
}

export default Welcome