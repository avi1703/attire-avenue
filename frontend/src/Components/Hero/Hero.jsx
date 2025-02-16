import React from 'react';
import './Hero.css';
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero_image.png";
import { Link } from 'react-router-dom';

const Hero = ({ scrollToLatestCollection }) => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className='hero-hand-icon'>
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>Collections</p>
          <p>for everyone</p>
        </div>
        <Link style={{textDecoration:"none"}} to="/" onClick={scrollToLatestCollection}>
          <div className="hero-latest-btn">
            <div>Latest Collection</div>
            <img src={arrow_icon} alt="" />
          </div>
        </Link>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  );
};

export default Hero;
