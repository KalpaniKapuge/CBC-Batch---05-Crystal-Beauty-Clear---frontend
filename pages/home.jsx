import AdminProductsPage from '../admin/adminProductsPage.jsx';
import Header from '../src/components/header.jsx'
import { Route,Routes } from 'react-router-dom';
import CartPage from './client/cart.jsx';



export default function HomePage() {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <Header/>
      <div className='w-full h-[calc(100vh-80px)] flex flex-col items-center'>
        
          
          <Routes path="/">
          <Route path="/" element={<h1>Home</h1>}/>
          <Route path="/products" element={<AdminProductsPage/>} />
          <Route path='/cart' element={<CartPage/>}/>
          <Route path="/contact" element={<h1 className='text-2xl font-bold'>Contact</h1>} />
          <Route path="/overview:id" element={<h1>ProductOverviewPage</h1>}/>
          <Route path='/checkout' element={<CheckoutPage/>}/>
           <Route path="/search" element={SearchProductsPage} />
          <Route path="/*" element={<h1 className='text-2xl font-bold'>404 Not Found</h1>} />
          </Routes>
          


      </div>

    </div>

  );
}