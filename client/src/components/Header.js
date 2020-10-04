import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={headerStyle}>
      <h1>Asset Tracker</h1>
      <Link style={linkStyle} to="/"> View Transactions </Link>
       | <Link style={linkStyle} to="/transfer"> Transfer Assets </Link>
       | <Link style={linkStyle} to="/create"> Create Assets </Link>
    </header>
  )
}

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px'
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none'
}

export default Header;
