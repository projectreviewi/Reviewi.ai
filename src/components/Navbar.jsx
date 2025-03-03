import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', background: '#007bff', color: 'white' }}>
      <h2>Reviewi.ai</h2>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
