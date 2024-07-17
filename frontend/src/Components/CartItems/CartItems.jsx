import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart } = useContext(ShopContext);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [addressMsg, setAddressMsg] = useState('');
  const [nameMsg, setNameMsg] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [acknowledgement, setAcknowledgement] = useState('');
  const [cartError, setCartError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoCodeSubmitted, setPromoCodeSubmitted] = useState(false);
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
      setDiscount(discount);
      setPromoCodeSubmitted(true);
    }
  };
  
  

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value); // Update phone state
      setPhoneMsg(''); // Clear any previous error message
    } else {
      setPhoneMsg('Phone number should be numeric and maximum 10 digits.'); // Display error message
      clearMessagesAfterDelay();
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setAddressMsg('');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameMsg('');
  }

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
      } else if (!name.trim()) {
        setNameMsg('Please Enter Your Name');
        clearMessagesAfterDelay();
      } else if (promoCode.trim() && !acknowledgement.trim()) {
        setSubmitError('Please click on submit button so that we may check that whether the code is correct or not');
        clearMessagesAfterDelay();
      } else {
        clearCart();
        const checkoutTimestamp = new Date().toISOString();
        navigate('/paymentgateway', {
          state: {
            phone,
            address,
            name,
            price: getTotalCartAmount() - discount,
            promoCode: promoCode || '',
            checkoutTimestamp,
          },
        });
      }
    } else {
      window.scrollTo(0, 0);
      navigate("/login?redirected=true");
    }
  };

  const clearMessagesAfterDelay = () => {
    setTimeout(() => {
      setError('');
      setSubmitError('');
      setPhoneMsg('');
      setAddressMsg('');
      setNameMsg('');
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
          <div className='name-box'>
            <label htmlFor="name">Name*</label>
            <p>(This name will be visible on your package and it will help us in delivering to correct person)</p>
               <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your Name"
                />
            {nameMsg && <p className="error-message">{nameMsg}</p>}
          </div>
          <p>If you have a promo code, Enter it here.</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder='promo code'
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled = {promoCodeSubmitted}
            />
            <button onClick={handlePromoCode} disabled = {promoCodeSubmitted}>Submit</button>
          </div>
          {error && <p className='promoCode-error'>{error}</p>}
          {submitError && !acknowledgement && <p className='promoCode-error'>{submitError}</p>}
          {acknowledgement && <p className='promoCode-acknowledgement'>{acknowledgement}</p>}
          <div className='cartitems-totals'>
            <h3>Total</h3>
            <h3>${getTotalCartAmount() - discount}</h3>
          </div>
          <hr />
          <button className='checkout-button' onClick={ handleCheckout }>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default CartItems;