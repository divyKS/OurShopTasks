import React from 'react'
import { Link } from 'react-router-dom'

const DashHeader = () => {
  return (
    <header style={{border: "1px solid grey"}}>
      <h2>dashboard header</h2>
      <div><Link to='/dashboard'>Company's Logo</Link></div>
      <nav>this will a navigation bar</nav>
    </header>
  )
}

export default DashHeader