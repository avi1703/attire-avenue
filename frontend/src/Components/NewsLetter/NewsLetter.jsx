import React, { useState } from 'react';
import './NewsLetter.css'

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [acknowledgement, setAcknowledgement] = useState('');

  const handleSubscribe = () => {
    if (!email) {
      setError('Please enter your email.');
      setAcknowledgement('');
      clearMessagesAfterDelay();
    } else {
      setError('');
      setAcknowledgement('Acknowledged!');
      clearMessagesAfterDelay();
    }
  };

  const clearMessagesAfterDelay = () =>{
    setTimeout(() => {
      setError('');
      setAcknowledgement('');
    }, 3000);
  }

  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers on Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input 
          type="email" 
          placeholder='Your Email Id' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <button onClick={handleSubscribe}>Subscribe!</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {acknowledgement && <p style ={{ color:'green'}}>{acknowledgement}</p>}
    </div>
  );
}

export default NewsLetter;
