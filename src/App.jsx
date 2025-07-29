import Header from './components/header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home.jsx';
import LoginPage from '../pages/login.jsx';
import SignUpPage from '../pages/signup.jsx';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
