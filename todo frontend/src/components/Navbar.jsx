import { Link, useNavigate } from 'react-router-dom';
export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto  px-6 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600">
              TodoApp
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}