import Header from './components/header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home.jsx';
import LoginPage from '../pages/login.jsx';
import RegisterPage from '../pages/register.jsx';
import TestingPage from '../pages/testingPage.jsx';
import { Toaster } from 'react-hot-toast';
import AddProductPage from '../admin/addProductPage.jsx';
import AdminProductsPage from '../admin/adminProductsPage.jsx';

function App() {
  return (
    <GoogleOAuthProvider clientId="1044000332395-in4om9f6ignl14euilehl25qr3m4f91d.apps.googleusercontent.com">
    <BrowserRouter>
      <div>
        <Header />
        <Toaster position='top-right'/>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/admin/add-product" element={<AddProductPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />

        </Routes>
      </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
