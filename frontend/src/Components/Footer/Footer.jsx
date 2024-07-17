import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/circular_logo.png'

const Footer = () => {
  return (
    <div className='footer'>
      <hr />
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <div>
          <p>Attire Avenue</p>
        </div>
      </div>
      <div className="footer-copyright">
        <p>Copyright © 2024 - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
