import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { removeAuthToken, getAuthToken, getUserRole } from "../utils/auth";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!getAuthToken();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = getUserRole();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  };

  const menuItems = [];

  if (userRole === "admin") {
    menuItems.push({ label: "Admin Dashboard", href: "/admin" });
  }
  if (userRole === "superadmin") {
    menuItems.push({ label: "Dashboard", href: "/superadmin" });
  }
  if (userRole === "user" || userRole === "superadmin") {
    menuItems.push({ label: "User Dashboard", href: "/dashboard" });
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md py-2.5 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            RBAC App
          </span>
        </Link>

        <div className="flex items-center lg:order-2">
          <div className="hidden mt-2 mr-4 sm:inline-block">
            <span></span>
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white bg-purple-700 font-medium rounded-lg text-sm px-6 py-2 lg:px-8 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-black bg-transparent border-2 border-purple-700 font-medium rounded-lg text-sm px-6 py-2 lg:px-8 lg:py-2.5 sm:mr-2 lg:mr-0"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <Link
              onClick={handleLogout}
              className="text-black bg-transparent border-2 border-purple-700 font-medium rounded-lg text-sm px-6 py-2 lg:px-8 lg:py-2.5 sm:mr-2 lg:mr-0"
            >
              Logout
            </Link>
          )}

          {menuItems.length > 0 && (
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "hidden" : "block"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "block" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          )}
        </div>

        <div
          className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="mobile-menu-2"
        >
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
