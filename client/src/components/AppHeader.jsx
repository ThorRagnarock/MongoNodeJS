import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'

export default function AppHeader() {

useEffect(() => {
  localStorage.removeItem('email');
  localStorage.removeItem('password');
}, [])

  return (
    <nav>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">register</Link>
        </li>
      </ul>
    </nav>
  )
}
