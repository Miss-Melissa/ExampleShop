import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className='header'>

      <div className="logo">
        <Link className='link-header-logo' to='/'><h3>Header</h3></Link>
      </div>

      <div className="header-right">
        <Link className='link-header' to='/'>Home</Link>
        <Link className='link-header' to='/contact'>Contact</Link>
        <Link className='link-header' to='/about'>About</Link>
        <Link className='link-header' to='/products'>Products</Link>
        <Link className='link-header' to='/productupload'>Upload Products</Link>

      </div>

    </div>
  );
}

export default Header;
