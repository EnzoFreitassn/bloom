import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-charcoal bg-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#C9A84C',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Navbar />
      <CartDrawer />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
