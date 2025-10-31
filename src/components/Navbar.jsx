import React, { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "About", path: "/about" },
    { name: "Jobs", path: "/jobs" },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-all duration-300 group ${
      isActive ? "text-emerald-400" : "text-gray-300 hover:text-white"
    }`;

  const regularLinkClass =
    "relative text-sm font-semibold transition-all duration-300 text-gray-300 hover:text-white group";

  const mobileNavLinkClass = ({ isActive }) =>
    `relative text-base font-semibold transition-all duration-300 ${
      isActive ? "text-emerald-400" : "text-gray-300 hover:text-white"
    }`;

  const mobileRegularLinkClass =
    "relative text-base font-semibold transition-all duration-300 text-gray-300 hover:text-white";

  const handleHashLinkClick = (e, hash) => {
    e.preventDefault();
    const id = hash.substring(1);
    if (isOpen) setIsOpen(false);

    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setIsModalOpen(false);
      setPassword("");
      setError("");
    } else {
      setError("Invalid password. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const openLoginModal = () => {
    setIsModalOpen(true);
    setError("");
    setPassword("");
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-gray-200 backdrop-blur-xl bg-opacity-90 sticky top-0 z-50 border-b border-slate-700/50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      
          <Link
            to="/"
            className="group flex items-center gap-2 transition-all duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-emerald-600 to-cyan-600 p-2 rounded-lg transform group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-emerald-400 group-hover:to-cyan-400 transition-all duration-500">
              TalentFlow
            </span>
          </Link>

     
          {!isLoggedIn && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) =>
                link.path.startsWith("/") ? (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={navLinkClass}
                    end={link.path === "/"}
                  >
                    <span className="px-4 py-2 block">
                      {link.name}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </NavLink>
                ) : (
                  <a
                    key={link.name}
                    href={link.path}
                    className={regularLinkClass}
                    onClick={(e) => handleHashLinkClick(e, link.path)}
                  >
                    <span className="px-4 py-2 block">
                      {link.name}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              )}
            </div>
          )}

 
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="group relative px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </span>
                </button>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="group relative px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                  <span className="relative text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    HR Login
                  </span>
                </button>
              )}
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl text-gray-300 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>


        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700/50">
            <ul className="flex flex-col items-center py-6 space-y-2 px-4">
              {!isLoggedIn &&
                navLinks.map((link, index) => (
                  <li
                    key={link.name}
                    className="w-full"
                    style={{ 
                      animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.1}s forwards` : 'none',
                      opacity: isOpen ? 0 : 1
                    }}
                  >
                    {link.path.startsWith("/") ? (
                      <NavLink
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={mobileNavLinkClass}
                        end={link.path === "/"}
                      >
                        <div className="px-6 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300 text-center">
                          {link.name}
                        </div>
                      </NavLink>
                    ) : (
                      <a
                        href={link.path}
                        onClick={(e) => handleHashLinkClick(e, link.path)}
                        className={mobileRegularLinkClass}
                      >
                        <div className="px-6 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300 text-center">
                          {link.name}
                        </div>
                      </a>
                    )}
                  </li>
                ))}

              <li className="pt-4 w-full px-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
                  >
                    HR Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100 border border-slate-700/50">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 rounded-2xl shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8 mt-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                HR Admin Login
              </h2>
              <p className="text-slate-400 text-sm">
                Enter your credentials to access the dashboard
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    placeholder="Enter your password"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                {error && (
                  <div className="mt-3 flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Demo credentials: <span className="font-mono text-emerald-400">admin</span></span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
