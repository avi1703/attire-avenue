import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QRRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const phone = params.get('phone');
    const address = params.get('address');
    const name = params.get('name');
    const price = params.get('price');
    const promoCode = params.get('promoCode');
    const checkoutTimestamp = params.get('checkoutTimestamp');

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
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default QRRedirect;