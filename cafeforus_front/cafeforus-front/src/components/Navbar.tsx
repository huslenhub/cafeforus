// components/Navbar.tsx
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';


const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-600 p-4 flex justify-between items-center z-50 shadow-md">
      <Link to="/" className="font-bold text-white text-2xl hover:underline">
        CafeForUs
      </Link>
      <div className="flex items-center">
        {user ? (
          <>
            <span className="text-white mr-4">Hello, {user}</span>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white mr-4 hover:underline">Login</Link>
            <Link to="/signup" className="text-white hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;