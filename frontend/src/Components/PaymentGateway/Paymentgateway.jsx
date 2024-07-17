import React, { useState } from 'react';
import './Paymentgateway.css'
import { useNavigate , useLocation } from 'react-router-dom';

const Paymentgateway = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const { phone, address, name,  price, promoCode, checkoutTimestamp } = location.state;

  const navigate = useNavigate();

  const handlePay = () => {
    // Process payment logic here
    navigate('/paymentslip', {
      state: {
        phone,
        address,
        name,
        price,
        promoCode,
        checkoutTimestamp,
      },
    });
  };

  return (
    <div className='paymentgateway'>
    <div className="paymentgateway-container">
      <h2>Payment Gateway</h2>
      <form id="payment-form" onSubmit={handlePay}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="account-number">Account Number</label>
          <input
            type="text"
            id="account-number"
            name="account-number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Bank Account Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Pay Now</button>
      </form>
    </div>
    </div>
  );
};



export default Paymentgateway
