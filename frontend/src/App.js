import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';
import PaymentSlip from './Pages/PaymentSlip'
import Paymentgateway from './Components/PaymentGateway/Paymentgateway'
import TermsConditions from './Pages/TermsConditions';
import RefundPolicy from './Pages/RefundPolicy';
import ContactUs from './Pages/ContactUs';
import QRRedirect from './Pages/QRRedirect'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path="/kids" element={<ShopCategory banner={kids_banner} category="kid" />} />
          <Route path='/product' element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/paymentslip" element={<PaymentSlip />} />
          <Route path="/paymentgateway" element={<Paymentgateway />} />
          <Route path="/termsandconditions" element={<TermsConditions />} />
          <Route path="/refundpolicy" element={<RefundPolicy />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/qrredirect" element={<QRRedirect />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
