import React from 'react'
import { Link } from 'react-router-dom'

const Public = () => {
  return (
    <>
      <header><h2>Your <i>tech</i> Shop</h2></header>
      <main>
          Landing Page
      </main>
      <footer><Link to='login'>Login</Link></footer>
    </>
  )
}

export default Public