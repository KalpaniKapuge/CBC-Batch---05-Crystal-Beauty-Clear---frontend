import Header from './components/header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home.jsx';
import LoginPage from '../pages/login.jsx';
import SignUpPage from '../pages/signup.jsx';
import TestingPage from '../pages/testingPage.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Toaster position='top-right'/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/testing" element={<TestingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
