import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CheckoutPopup = ({ totalAfterDiscount, onClose, onPay }) => {
  return (
    <>
      <div className="modal-overlay"></div>
       <div className="popup">
         <div className="popup-inner">
           <h2>Checkout Summary</h2>
           <p>Total to Pay: ${totalAfterDiscount}</p>
           <div className="popup-buttons">
             <button onClick={onPay}>Pay</button>
             <button onClick={onClose}>Close</button>
           </div>
         </div>
       </div>
    </>
  );
};

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart,clearCart } = useContext(ShopContext);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [addressMsg, setAddressMsg] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [password, setPassword] = useState('');
  const [bankAccountMsg, setBankAccountMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [acknowledgement, setAcknowledgement] = useState('');
  const [cartError, setCartError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const navigate = useNavigate();

  const handlePromoCode = () => {
    if (!promoCode.trim()) {
      setError('Please Enter a Promo Code');
      setAcknowledgement('');
      setSubmitError('');
      clearMessagesAfterDelay();
    } else {
      setError('');
      const discount = Math.floor(Math.random() * 40) + 1; // Generate random discount between 1 to 40
      setAcknowledgement(`Acknowledged! You get a discount of $${discount}`);
      setSubmitError('');
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setPhoneMsg('');
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setAddressMsg('');
  };

  const handleBankAccountChange = (e) => {
    setBankAccount(e.target.value);
    setBankAccountMsg('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMsg('');
  };

  const handleCheckout = () => {
    if (localStorage.getItem('auth-token')) {
      const cartIsEmpty = Object.values(cartItems).every((count) => count === 0);
      if (cartIsEmpty) {
        setCartError('No items in the cart!');
        clearMessagesAfterDelay();
      } else if (!phone.trim()) {
        setPhoneMsg('Please Enter Phone Number');
        clearMessagesAfterDelay();
      } else if (!address.trim()) {
        setAddressMsg('Please Enter an Address Here!');
        clearMessagesAfterDelay();
      } else if (!bankAccount.trim()) {
        setBankAccountMsg('Please Enter Your Account Number');
        clearMessagesAfterDelay();
      } else if (!password.trim()) {
        setPasswordMsg('Please Enter Your Bank Account Password');
        clearMessagesAfterDelay();
      } else if (promoCode.trim() && !acknowledgement.trim()) {
        setSubmitError('Please click on submit button so that we may check that whether the code is correct or not');
        clearMessagesAfterDelay();
      } else {
        const totalPrice = getTotalCartAmount();
        let totalPriceAfterDiscount = totalPrice;
        if (acknowledgement.includes('Acknowledged! You get a discount of $')) {
          const discount = parseInt(acknowledgement.split('$')[1]);
          totalPriceAfterDiscount = totalPrice - discount;
        }
        setTotalAfterDiscount(totalPriceAfterDiscount);
        setShowPopup(true);
      }
    } else {
      window.scrollTo(0, 0);
      navigate("/login?redirected=true");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePay = () => {
    // Implement payment logic here
    // For example: redirect to payment gateway or update backend with payment details
    alert(`Payment successful for $${totalAfterDiscount}`);
    clearCart();
    setShowPopup(false);
    // Redirect to payment slip page with necessary data
    const checkoutTimestamp = new Date().getTime(); // Assuming checkout time is current time
    navigate('/paymentslip', {
      state: {
        phone,
        address,
        bankAccount,
        price: totalAfterDiscount,
        promoCode,
        checkoutTimestamp,
      },
    });
  };

  const clearMessagesAfterDelay = () =>{
    setTimeout(() => {
      setError('');
      setSubmitError('');
      setPhoneMsg('');
      setAddressMsg('');
      setBankAccountMsg('');
      setPasswordMsg('');
      setCartError('');
    }, 3000);
  }


  return (
    <div className='cartitems'>
      <div className="cartitem-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {cartError && (
       <div>
         {window.innerWidth > 768
          ? (<h1 style={{ color: 'red' }}>{cartError}</h1>
          ) : (
          <p style={{ color: 'red' }}>{cartError}</p>
          )}
        </div>
      )}

      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitem-format-main">
                <img src={e.image} className='carticon-product-icon' alt="" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>${e.new_price * cartItems[e.id]}</p>
                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
              </div>
              <hr />
            </div>
          )
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div className='cart'>
            <div className="cartitems-total-item">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className='cartitems-total-item'>
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
            <div className='cartitems-total-item'>
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
              />
            </div>
            {phoneMsg && <p className="error-message">{phoneMsg}</p>}
            <div className='cartitems-total-item'>
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter your address"
              />
            </div>
            {addressMsg && <p className="error-message">{addressMsg}</p>}
          </div>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here.</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder='promo code'
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={handlePromoCode}>Submit</button>
          </div>
          {error && <p className='promoCode-error'>{error}</p>}
          {submitError && !acknowledgement && <p className='promoCode-error'>{submitError}</p>}
          {acknowledgement && <p className='promoCode-acknowledgement'>{acknowledgement}</p>}
          <div className="bankaccount-details">
            <label htmlFor="bankAccont">Bank Account Number*</label>
            <input
              type="text"
              id="bankAccount"
              value={bankAccount}
              onChange={handleBankAccountChange}
              placeholder="Enter your bank account number"
            />
            {bankAccountMsg && <p className="error-message">{bankAccountMsg}</p>}
            <label htmlFor="password">Bank Account Password*</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your bank account password"
            />
            {passwordMsg && <p className="error-message">{passwordMsg}</p>}
          </div>
          <button className='checkout-button' onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
      {showPopup && (
            <CheckoutPopup
              totalAfterDiscount={totalAfterDiscount}
              onClose={handleClosePopup}
              onPay={handlePay}
            />
          )}
    </div>
  );
}

export default CartItems;