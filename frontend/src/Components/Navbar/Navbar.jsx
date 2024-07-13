import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();
  const [menu, setMenu] = useState('');
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
    document.body.classList.toggle('dropdown-open');
  };

  useEffect(() => {
    const path = location.pathname.slice(1);
    setMenu(path);
  }, [location]);

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => setMenu('')}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/'>Shop</Link>
          {menu === '' && location.pathname === '/' ? <hr /> : null}
        </li>
        <li onClick={() => setMenu('mens')}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/mens'>Men</Link>
          {menu === 'mens' && location.pathname === '/mens' ? <hr /> : null}
        </li>
        <li onClick={() => setMenu('womens')}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/womens'>Women</Link>
          {menu === 'womens' && location.pathname === '/womens' ? <hr /> : null}
        </li>
        <li onClick={() => setMenu('kids')}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/kids'>Kids</Link>
          {menu === 'kids' && location.pathname === '/kids' ? <hr /> : null}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')
          ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace("/") }}>Logout</button>
          : <Link to="/login"><button>Login</button></Link>}
        <Link to="/cart"><img src={cart_icon} alt="Cart" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;