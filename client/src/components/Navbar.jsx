import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { notifications } = useSelector((state) => state.chat);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="glass sticky top-0 z-[50] transition-all duration-300 border-b border-white/20">
        <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* New Left Corner Hamburger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 sm:mr-5 p-2 rounded-xl text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 group shadow-sm border border-transparent hover:border-blue-200"
            >
              <svg className="h-7 w-7 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-[var(--color-primary)]/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900">
                Skill<span className="text-[var(--color-primary)]">Serve</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/requests" className="relative group text-gray-600 hover:text-[var(--color-primary)] px-3 py-2 text-sm font-semibold transition-colors">
              Browse Services
              <span className="absolute bottom-1 left-3 w-[calc(100%-24px)] h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="relative group text-gray-600 hover:text-[var(--color-primary)] px-3 py-2 text-sm font-semibold transition-colors">
                  Dashboard
                  <span className="absolute bottom-1 left-3 w-[calc(100%-24px)] h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                </Link>
                <Link to="/profile" className="relative group text-gray-600 hover:text-[var(--color-primary)] px-3 py-2 text-sm font-semibold transition-colors">
                  Profile
                  <span className="absolute bottom-1 left-3 w-[calc(100%-24px)] h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                </Link>
                <Link to="/chat" className="relative group text-gray-600 hover:text-[var(--color-primary)] px-3 py-2 text-sm font-semibold transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 shadow-sm shadow-red-500/30 rounded-full animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                  <span className="absolute bottom-1 left-3 w-[calc(100%-24px)] h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                </Link>
                {/* Profile Section with Precise Dropdown */}
                <div className="flex items-center gap-3 z-50 ml-6 group cursor-pointer">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-[var(--color-primary)]/40 hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  {/* Name container - perfectly positioned relative to hold the dropdown directly beneath it */}
                  <div className="relative flex flex-col items-start transition-all duration-300 transform group-hover:translate-x-1 py-1">
                    <span className="text-sm font-bold text-gray-800 leading-none group-hover:text-[var(--color-primary)] transition-colors">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize leading-tight mt-1">{user.role}</span>
                    
                    {/* Small dropdown completely anchored to the bottom-left of the name */}
                    <div className="absolute top-full left-0 pt-2 w-24 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-xl shadow-md border border-gray-100 rounded-xl overflow-hidden transform origin-top-left scale-95 group-hover:scale-100 transition-all duration-300">
                        <div className="p-1">
                          <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-1 py-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group/btn"
                          >
                            <svg className="w-3.5 h-3.5 mr-1 transform group-hover/btn:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="ml-4 flex items-center space-x-4">
                <Link to="?auth=login" className="text-gray-600 hover:text-[var(--color-primary)] font-semibold px-3 py-2 transition-all duration-300 hover:-translate-y-0.5">
                  Log in
                </Link>
                <Link to="?auth=register" className="btn-primary transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)]"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-2'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl rounded-b-2xl">
          <Link to="/requests" className="block px-4 py-3 mx-2 my-1 rounded-xl text-base font-semibold text-gray-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
            Browse Services
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="block px-4 py-3 mx-2 my-1 rounded-xl text-base font-semibold text-gray-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="block px-4 py-3 mx-2 my-1 rounded-xl text-base font-semibold text-gray-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/chat" className="flex justify-between items-center px-4 py-3 mx-2 my-1 rounded-xl text-base font-semibold text-gray-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Messages
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 shadow-sm shadow-red-500/30 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="border-t border-gray-100/50 mt-4 pt-4 pb-2 mx-2">
                <div className="flex items-center px-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center shadow-md mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-800 leading-none">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize mt-1">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-gray-100/50 mt-2 pt-4 pb-2 mx-2 space-y-2">
              <Link to="?auth=login" className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Log in
              </Link>
              <Link to="?auth=register" className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>

      {/* Sidebar Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-[100] transition-all duration-500 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-white/80 backdrop-blur-3xl shadow-2xl z-[110] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) border-r border-white/40 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100/50">
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] tracking-tight">Menu</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          {/* Internal Links Requested by User */}
          <Link to="/quick-hire" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-gray-700 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:shadow-sm border border-transparent hover:border-[var(--color-primary)]/20 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            Quick Hire
          </Link>
          
          <Link to="/planner-package" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-gray-700 hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 hover:shadow-sm border border-transparent hover:border-[var(--color-secondary)]/20 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            Planner Package
          </Link>

          <Link to="/service-history" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm border border-transparent hover:border-emerald-200 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            Service History
          </Link>
        </div>

        {user && (
          <div className="p-6 border-t border-gray-100/50 bg-white/50 mt-auto">
            <button
              onClick={() => { logout(); setIsSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[15px] font-bold text-gray-700 bg-white border border-gray-200 hover:text-white hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-blue-300 group"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
