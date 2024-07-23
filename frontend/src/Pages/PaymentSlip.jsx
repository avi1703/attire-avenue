import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CSS/PaymentSlip.css';
import { ShopContext } from '../Context/ShopContext';

const PaymentSlip = () => {
  const [authToken, setAuthToken] = useState('');
  const [checkoutTime, setCheckoutTime] = useState('');
  const [hasClearedCart, setHasClearedCart] = useState(false); // Flag to check if cart is cleared
  const { clearCart } = useContext(ShopContext);
  const location = useLocation();
  const { phone, address, name, price, promoCode, checkoutTimestamp } = location.state || {};

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setAuthToken(token);

    if (checkoutTimestamp) {
      const checkoutDate = new Date(checkoutTimestamp);
      setCheckoutTime(checkoutDate.toLocaleString());
    }

    // Clear the cart only if it hasn't been cleared yet
    if (!hasClearedCart) {
      clearCart();
      setHasClearedCart(true); // Set flag to true to prevent further clearing
    }
  }, [checkoutTimestamp, clearCart, hasClearedCart]);

  const formatOrderID = (token) => {
    if (!token) {
      return Math.random().toString().slice(2, 12); // Generate a random 10-digit number
    }
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
            <span className='payment-item-values'>{phone || 'N/A'}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Address:</span>
            <span className='payment-item-values'>{address || 'N/A'}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Name:</span>
            <span className='payment-item-values'>{name || 'N/A'}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Price:</span>
            <span className='payment-item-values'>${price || 'N/A'}</span>
          </div>
          {promoCode && (
            <div className="payment-item">
              <span className='payment-item-headers'>Promo Code:</span>
              <span className='payment-item-values'>{promoCode}</span>
            </div>
          )}
          <div className="payment-item">
            <span className='payment-item-headers'>Checkout Time:</span>
            <span className='payment-item-values'>{checkoutTime || 'N/A'}</span>
          </div>
          <div className="payment-item">
            <span className='payment-item-headers'>Payment Status:</span>
            <span className='payment-item-values success-message'>Successful!</span>
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
