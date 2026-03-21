import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from '../api/axios';
import { setNotifications } from '../store/chatSlice';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const { notifications } = useSelector((state) => state.chat);
  const systemNotifications = useSelector((state) => state.notifications?.notifications || []);
  const dispatch = useDispatch();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const systemUnreadCount = systemNotifications.filter(n => !n.read).length;
  
  const isChatPage = location.pathname.startsWith('/chat');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clear chat red popup badges explicitly when navigating to the chat page
  useEffect(() => {
    if (isChatPage && unreadCount > 0) {
      dispatch(setNotifications([]));
    }
  }, [isChatPage, unreadCount, dispatch]);

  // Close sidebar on route change or escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isSidebarOpen]);

  return (
    <>
      {/* 
        Fixed Navbar Structure 
        We use fixed positioning so it never scrolls, and an explicit width.
      */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-3xl z-[100] transition-all duration-300 border-b border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] 
        before:absolute before:inset-x-0 before:-bottom-[1px] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-blue-300/30 before:to-transparent">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex justify-between h-20 items-center">
          
          <div className="flex items-center">
            {/* Eye-catching Animated Hamburger Icon */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 sm:mr-5 p-3 rounded-[16px] bg-slate-50 shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-blue-700 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-500 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all duration-300 group focus:outline-none border border-slate-200"
              aria-label="Open Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center group-hover:gap-[3px] transition-all duration-300">
                <span className="w-full h-[3px] bg-current rounded-full transform transition-all duration-300 group-hover:-translate-y-[1px]"></span>
                <span className="w-3/4 h-[3px] bg-current rounded-full transform transition-all duration-300 group-hover:w-full self-start"></span>
                <span className="w-full h-[3px] bg-current rounded-full transform transition-all duration-300 group-hover:translate-y-[1px]"></span>
              </div>
            </button>

            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-[0_8px_20px_rgba(37,99,235,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 drop-shadow-sm">
                Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">Serve</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/requests" className="relative group text-slate-800 hover:text-blue-700 px-3 py-2 text-[15px] font-black transition-colors uppercase tracking-wider">
              Browse Services
              <span className="absolute bottom-0.5 left-3 w-[calc(100%-24px)] h-[3px] bg-gradient-to-r from-blue-600 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"></span>
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="relative group text-slate-800 hover:text-blue-700 px-3 py-2 text-[15px] font-black transition-colors uppercase tracking-wider">
                  Dashboard
                  <span className="absolute bottom-0.5 left-3 w-[calc(100%-24px)] h-[3px] bg-gradient-to-r from-blue-600 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"></span>
                </Link>
                <Link to="/profile" className="relative group text-slate-800 hover:text-blue-700 px-3 py-2 text-[15px] font-black transition-colors uppercase tracking-wider">
                  Profile
                  <span className="absolute bottom-0.5 left-3 w-[calc(100%-24px)] h-[3px] bg-gradient-to-r from-blue-600 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"></span>
                </Link>
                
                {/* Chat Link With Conditional Popup Badge */}
                <Link to="/chat" className="relative group text-slate-800 hover:text-blue-700 px-3 py-2 text-[15px] font-black transition-colors flex items-center uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  
                  {/* Badge strictly tied to Unread messages, explicitly zeroes out when visiting /chat */}
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 h-4 min-w-[16px] text-[10px] font-black text-white bg-red-600 shadow-[0_2px_8px_rgba(220,38,38,0.5)] rounded-full animate-pulse border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                  <span className="absolute bottom-0.5 left-3 w-[calc(100%-24px)] h-[3px] bg-gradient-to-r from-blue-600 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"></span>
                </Link>

                {/* Desktop Profile Dropdown Component */}
                <div className="flex items-center gap-3 z-50 ml-6 group cursor-pointer relative py-2 bg-slate-50 border border-slate-200/80 px-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 font-black flex items-center justify-center shadow-inner transform transition-all duration-300 group-hover:scale-105 overflow-hidden border border-white">
                    {user.profileImage ? (
                      <img src={`${BASE_URL}${user.profileImage}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (user.name.charAt(0))}
                  </div>
                  
                  <div className="flex flex-col items-start transition-all duration-300">
                    <span className="text-sm font-black text-slate-900 leading-none group-hover:text-blue-700 transition-colors tracking-tight">{user.name}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{user.role}</span>
                  </div>

                  {/* Super Compact Sign-Out Pill */}
                  <div className="absolute top-[56px] right-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-slate-100 rounded-[18px] overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 transition-all duration-300 p-1.5 ring-1 ring-slate-900/5">
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-black text-slate-500 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-[14px] transition-all cursor-pointer group/btn"
                      >
                        <svg className="w-3.5 h-3.5 transform group-hover/btn:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="ml-4 flex items-center space-x-4">
                <Link to="?auth=login" className="text-slate-800 hover:text-blue-700 font-black text-[15px] px-3 py-2 transition-colors uppercase tracking-widest">
                  Log in
                </Link>
                <Link to="?auth=register" className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-black px-6 py-3 rounded-xl hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-xs border border-white/20">
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Right Edge Placeholder (Keeps layout centered properly) */}
          <div className="sm:hidden w-10"></div>
          
        </div>
      </nav>

      {/* spacer div to perfectly prevent underlying content from sliding under the fixed navbar */}
      <div className="h-20 w-full shrink-0"></div>

      {/* Stunning Slide-in Hamburger Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[110] transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Slide-in Panel 25% 60% 15% proportioned */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] sm:w-[340px] bg-white/95 backdrop-blur-3xl shadow-[30px_0_60px_rgba(0,0,0,0.2)] z-[120] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) border-r border-slate-200 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Banner reduced in size significantly to ~25% */}
        <div className="h-[150px] max-h-[25vh] bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-500 p-5 flex flex-col justify-between relative overflow-hidden shrink-0 shadow-inner">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-cyan-300/30 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <span className="text-white font-black text-[18px] tracking-tight drop-shadow-sm flex items-center gap-1.5">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              </div>
              Menu
            </span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 bg-white/10 hover:bg-white text-white hover:text-blue-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 shadow-sm"
              aria-label="Close Menu"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3 relative z-10 group mt-auto w-full">
              {/* Profile card drastically shrunk */}
              <div className="w-10 h-10 rounded-[12px] bg-white text-blue-700 shadow-md border-[2px] border-white/90 flex items-center justify-center font-black text-[16px] overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                {user.profileImage ? (
                  <img src={`${BASE_URL}${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (user.name.charAt(0).toUpperCase())}
              </div>
              <div className="flex flex-col flex-1 shrink min-w-0">
                <div className="text-white font-black text-sm leading-tight drop-shadow-sm truncate">{user.name}</div>
                <div className="text-cyan-100 text-[9px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1 opacity-90 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse shadow-sm shrink-0"></span>
                  {user.role}
                </div>
              </div>

              {/* Shrunk Logout Icon button */}
              <button
                onClick={() => { logout(); setIsSidebarOpen(false); }}
                title="Sign Out"
                className="ml-auto flex items-center justify-center shrink-0 w-8 h-8 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-white/10 backdrop-blur-md shadow-inner transition-colors group/logout"
              >
                <svg className="w-4 h-4 text-white/90 group-hover:text-rose-400 transform group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex gap-2 mt-auto w-full">
              <Link to="?auth=login" onClick={()=>setIsSidebarOpen(false)} className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-lg backdrop-blur-md border border-white/30 transition-colors shadow-sm uppercase tracking-widest text-center flex-1">
                Login
              </Link>
              <Link to="?auth=register" onClick={()=>setIsSidebarOpen(false)} className="px-3 py-2 bg-white text-blue-700 hover:text-blue-800 text-xs font-black rounded-lg shadow-md transition-colors hover:scale-105 transform uppercase tracking-widest text-center flex-1">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Links - Name Cards shrunk */}
        <div className="flex-1 px-4 py-4 space-y-1.5 relative shadow-inner overflow-y-auto z-10">
          
          <Link to="/" className="flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-black text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 border border-transparent hover:border-blue-200 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm border border-slate-200 group-hover:border-blue-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              Platform Home
            </div>
            <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Link>

          <Link to="/requests" className="flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-black text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm border border-slate-200 group-hover:border-indigo-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              Browse Services
            </div>
            <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Link>

          <Link to="/quick-hire" className="flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-black text-slate-700 hover:text-fuchsia-700 hover:bg-fuchsia-50/80 border border-transparent hover:border-fuchsia-200 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-fuchsia-100 group-hover:text-fuchsia-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm border border-slate-200 group-hover:border-fuchsia-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              Quick Hire
            </div>
            <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-fuchsia-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Link>
          
          <Link to="/planner-package" className="flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-black text-slate-700 hover:text-purple-700 hover:bg-purple-50/80 border border-transparent hover:border-purple-200 transition-all group" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm border border-slate-200 group-hover:border-purple-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              Planner Packages
            </div>
            <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Link>

          {user && (
            <div className="pt-4 mt-3 border-t-2 border-slate-100/60 relative">
              <span className="absolute -top-[7px] left-4 bg-white px-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">Personal</span>
              
              <Link to="/service-history" className="flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-black text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200 transition-all group mb-1" onClick={() => setIsSidebarOpen(false)}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm border border-slate-200 group-hover:border-emerald-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  Service History
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </Link>

              <Link to="/notifications" className="flex items-center justify-between px-3 py-2.5 rounded-[14px] text-[13px] font-black text-slate-700 hover:text-rose-700 hover:bg-rose-50/80 border border-transparent hover:border-rose-200 transition-all group relative overflow-hidden" onClick={() => setIsSidebarOpen(false)}>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-rose-100 group-hover:text-rose-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm border border-slate-200 group-hover:border-rose-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  Notifications
                </div>
                {systemUnreadCount > 0 ? (
                  <span className="relative z-10 inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white bg-rose-500 shadow-[0_2px_8px_rgba(244,63,94,0.4)] rounded-full animate-pulse border border-white">
                    {systemUnreadCount} New
                  </span>
                ) : (
                  <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Shrunk Water Animation down to ~15-20% max-height so links have majority screen 70% */}
        <div className="mt-auto h-20 md:h-24 max-h-[15vh] relative overflow-hidden shrink-0 bg-slate-50/50 flex items-end opacity-95">
          <svg className="absolute w-[200%] h-[120px] left-0 bottom-0 pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <style>{`
              .wave { animation: drift 12s linear infinite; }
              .wave-2 { animation: drift 8s linear infinite reverse; }
              .wave-3 { animation: drift 15s linear infinite; }
              @keyframes drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            `}</style>
            <path className="wave-3" fill="rgba(37,99,235,0.15)" d="M0,50 C150,80 350,0 500,50 C650,100 850,20 1000,50 L1000,100 L0,100 Z M1000,50 C1150,80 1350,0 1500,50 C1650,100 1850,20 2000,50 L2000,100 L1000,100 Z" />
            <path className="wave-2" fill="rgba(34,211,238,0.25)" d="M0,70 C200,30 300,90 500,70 C700,50 800,100 1000,70 L1000,100 L0,100 Z M1000,70 C1200,30 1300,90 1500,70 C1700,50 1800,100 2000,70 L2000,100 L1000,100 Z" />
            <path className="wave" fill="rgba(59,130,246,0.5)" d="M0,85 C250,60 350,110 500,85 C650,60 750,110 1000,85 L1000,100 L0,100 Z M1000,85 C1250,60 1350,110 1500,85 C1650,60 1750,110 2000,85 L2000,100 L1000,100 Z" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default Navbar;
