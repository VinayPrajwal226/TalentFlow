import { useEffect } from 'react';
import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import { useAuth } from './context/AuthContext'; 
import { LockClosedIcon } from '@heroicons/react/24/solid';

const LoginPrompt = () => {
  return (
    <div className="text-center max-w-lg mx-auto mt-20 p-8 bg-white rounded-lg shadow-md">
      <LockClosedIcon className="w-16 h-16 text-indigo-600 mx-auto" />
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Admin Access Required
      </h2>
      <p className="mt-2 text-gray-600">
        Please use the "HR Login" button in the navigation bar.
      </p>
    </div>
  );
};

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth(); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, isLoggedIn]);

  const publicPaths = ['/', '/about', '/jobs'];
  const isPublicPage = publicPaths.includes(location.pathname) || 
                       location.pathname.startsWith('/jobs/');
                       

  const adminPaths = ['/admin/jobs', '/admin/jobs/new', '/candidates', '/assessments']; 
  const isAdminPage = adminPaths.some(path => location.pathname.startsWith(path)) || 
                      location.pathname.startsWith('/candidates/') || 
                      location.pathname.startsWith('/assessments/'); 
        const isDashboardPage = isLoggedIn && location.pathname === '/';              
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar /> 
      
      
      <main className="flex-grow  bg-gray-50"> 
        
        
        {isAdminPage && !isLoggedIn ? <LoginPrompt /> : <Outlet />}
        
      </main>

      {!isDashboardPage && !isAdminPage && <Footer />}
    </div>
  )
}

export default App;