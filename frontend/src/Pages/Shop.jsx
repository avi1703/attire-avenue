import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';

const Shop = () => {
  const latestCollectionRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/latestCollections') {
      latestCollectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const scrollToLatestCollection = (e) => {
    e.preventDefault(); // Prevent default Link behavior
    latestCollectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Hero scrollToLatestCollection={scrollToLatestCollection} />
      <Popular />
      <Offers />
      <div ref={latestCollectionRef}>
        <NewCollections />
      </div>
      <NewsLetter />
    </div>
  );
};

export default Shop;
