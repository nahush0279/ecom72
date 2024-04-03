import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductAdmin from './components/Admin/ProductAdmin';
import Data from './components/page/Products';
import Product from './components/page/Product';
import Login from './components/page/Login';
import PrivateRoute from './PrivateRoute';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import Admin from './components/page/Admin';
import Nav from './components/common/Nav';
import Cart from './components/page/Cart';
import Success from './components/page/Success';
import Cancel from './components/page/Cancel';
import ResetPassword from './components/page/ResetPassword';
import Footer from './components/common/Footer';

function App() {
  const isAdmin = useSelector(state => state.auth.role) == 'admin';


  return (
    <BrowserRouter>
      <PrimeReactProvider>
        <div className='app'>
          <Nav />
          <div className='content'>
          <Routes>
            <Route exact path='/admin' element={<PrivateRoute isAuth={isAdmin} />}>
              <Route exact path='/admin' element={<Admin />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/product" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Data />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/reset" element={<ResetPassword />} />
          </Routes>

          </div>

        <Footer />
        </div>
      </PrimeReactProvider>
    </BrowserRouter>
  );
}

export default App;