import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import QRCode from 'qrcode.react'; // Import the QR code library
import './Paymentgateway.css';
import chip from '../Assets/chip.png';
import gpay from '../Assets/GPay_logo.png';
import paytm from '../Assets/paytm_logo.png';
import phonepe from '../Assets/phonepe_logo.png';
import { ShopContext } from '../../Context/ShopContext';

const Paymentgateway = () => {
  const {clearCart} = useContext(ShopContext);
  const [activeForm, setActiveForm] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [upiVisible, setUpiVisible] = useState(false);
  const [showQR, setShowQR] = useState(false); // State to handle QR code visibility
  const location = useLocation();
  const navigate = useNavigate();

  const { phone, address, name, price, promoCode, checkoutTimestamp } = location.state;

  const handlePay = () => {
    navigate('/paymentslip', {
      state: {
        phone,
        address,
        name,
        price,
        promoCode,
        checkoutTimestamp,
      },
      replace: true,
    });
  };

  const handleInputChange = (e, formId) => {
    const form = e.target.form;
    const anyValueFilled = Array.from(form.elements).some(input => input.value !== '');
    setActiveForm(anyValueFilled ? formId : null);

    if (e.target.name === 'cardNumber') {
      setCardNumber(e.target.value);
    }
  };

  const handleCancel = () => {
    setActiveForm(null);
    document.querySelectorAll('.form input').forEach(input => input.value = '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length !== 16) {
      alert("Card number must be exactly 16 digits.");
      return;
    }
    handlePay();
  };

  const handleKeyPress = (e) => {
    const charCode = e.which || e.keyCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[a-zA-Z\s]*$/)) {
      e.preventDefault();
    }
  };

  const toggleUpiOptions = () => {
    setUpiVisible(!upiVisible);
  };

  const handleUPIClick = () => {
    setShowQR(true); // Show the QR code when a UPI icon is clicked
    clearCart();
  };

  const generateQRUrl = () => {
    const baseUrl = "https://attire-avenue-frontend.vercel.app"; // Use your Vercel site URL
    const params = new URLSearchParams({
      phone,
      address,
      name,
      price,
      promoCode,
      checkoutTimestamp,
    });
    return `${baseUrl}/qrredirect?${params.toString()}`;
  };

  return (
    <div className="card-form-container">
      {showQR && <div className="overlay"></div>} {/* Overlay to prevent interaction */}

      <div className={`card-form ${activeForm === 1 ? '' : 'inactive'} ${upiVisible ? 'expanded' : ''}`}>
        <div className="card blue-card">
          <div className="bankname">BANK</div>
          <div className="card-chip"><img src={chip} alt="chip" /></div>
          <div className="card-number"><span>1234</span> <span>5678</span> <span>9012</span> <span>3456</span></div>
          <div className="card-date">12/24</div>
          <div className="card-name">CARDHOLDER NAME</div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="CARD NUMBER"
            name="cardNumber"
            pattern="\d{16}"
            maxLength="16"
            minLength="16"
            onChange={(e) => handleInputChange(e, 1)}
            disabled={activeForm !== null && activeForm !== 1}
            required
          />
          <input
            type="text"
            placeholder="CARDHOLDER NAME"
            name="cardholderName"
            onKeyPress={handleKeyPress}
            onChange={(e) => handleInputChange(e, 1)}
            disabled={activeForm !== null && activeForm !== 1}
            required
          />
          <div className="form-row">
            <input
              type="number"
              placeholder="MM"
              onChange={(e) => handleInputChange(e, 1)}
              disabled={activeForm !== null && activeForm !== 1}
              required
            />
            <input
              type="number"
              placeholder="YY"
              onChange={(e) => handleInputChange(e, 1)}
              disabled={activeForm !== null && activeForm !== 1}
              required
            />
            <input
              type="number"
              placeholder="CVV"
              onChange={(e) => handleInputChange(e, 1)}
              disabled={activeForm !== null && activeForm !== 1}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="pay-now" disabled={activeForm !== null && activeForm !== 1}>
              PAY NOW
            </button>
            {activeForm === 1 && <button style={{ color: "#007bff", border: "3px solid #007bff" }} type="button" className="cancel" onClick={handleCancel}>CANCEL</button>}
          </div>
        </form>
        <button className="upi-button" onClick={toggleUpiOptions}>
          {upiVisible ? 'HIDE UPI OPTIONS' : 'SHOW UPI OPTIONS'}
        </button>
        {upiVisible && (
          <div className="upi-icons">
            <div className="upi-icon" onClick={handleUPIClick}><img src={gpay} alt="GPay" /></div>
            <div className="upi-icon" onClick={handleUPIClick}><img src={paytm} alt="Paytm" /></div>
            <div className="upi-icon" onClick={handleUPIClick}><img src={phonepe} alt="PhonePe" /></div>
          </div>
        )}
      </div>
      {showQR && (
        <div className="qr-modal">
          <div className="qr-code">
            <QRCode value={generateQRUrl()} size={256} />
          </div>
          <p style={{ color: "white", fontWeight: "600" }}>Please Note that the Payment Slip will be shown in the Device on which you are scanning this.</p>
          <Link style={{ color: "pink", fontWeight: "600" }} to="/" replace>Home Page</Link>
        </div>
      )}
      <p>Please Note: When you click on any of the UPI icons, a QR code will be displayed, and the items in your cart will be cleared. Ensure that you are certain about proceeding with the payment, as clearing the cart is irreversible.</p>
      <p>Also, Please Check our <Link to="/refundpolicy" style={{ color: 'red' }}>Refund Policy</Link> before Paying,</p>
      <p>Thank you</p>
      <p>~Team Attire Avenue</p>
    </div>
  );
};

export default Paymentgateway;
