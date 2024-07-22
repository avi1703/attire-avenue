import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CSS/PaymentSlip.css';

const PaymentSlip = () => {
  const [authToken, setAuthToken] = useState('');
  const [checkoutTime, setCheckoutTime] = useState('');
  const location = useLocation();
  const { phone, address, name, price, promoCode, checkoutTimestamp } = location.state || {};

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setAuthToken(token);

    if (checkoutTimestamp) {
      const checkoutDate = new Date(checkoutTimestamp);
      setCheckoutTime(checkoutDate.toLocaleString());
    }
  }, [checkoutTimestamp]);

  const formatOrderID = (token) => {
    if (!token) return '';
    if (token.length === 15) return token;
    if (token.length > 15) return token.slice(0, 15);
    return token.padEnd(15, '0');
  };

  return (
    <div className='payment'>
      <div className={`payment-container ${promoCode ? '' : 'no-promo'}`}>
        <h1>Payment Slip</h1>
        <hr />
        <div className="payment-details">
          <div className="payment-item">
            <span className='payment-item-headers'>Order Id:</span>
            <span className='payment-item-values'>{formatOrderID(authToken)}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Phone:</span>
            <span className='payment-item-values'>{phone}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Address:</span>
            <span className='payment-item-values'>{address}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Name:</span>
            <span className='payment-item-values'>{name}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Price:</span>
            <span className='payment-item-values'>${price}</span>
          </div>
          {promoCode && (
            <div className="payment-item">
              <span className='payment-item-headers'>Promo Code:</span>
              <span className='payment-item-values'>{promoCode}</span>
            </div>
          )}
          <div className="payment-item">
            <span className='payment-item-headers'>Checkout Time:</span>
            <span className='payment-item-values'>{checkoutTime}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Payment Status:</span>
            <span className='payment-item-values sucess-message'>Successful!</span>
          </div>
        </div>
      </div>
      <Link className='goback-button' to="/" replace>
        <button>Go Back</button>
      </Link>
    </div>
  );
};

export default PaymentSlip;