import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { addNotification } from '../store/notificationSlice';
import axios from '../api/axios'; // For direct API calls if needed

function AuthModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authMode = searchParams.get('auth');
  const isOpen = !!authMode;
  
  // 3 Modes: 'login', 'register', 'admin'
  const [activeTab, setActiveTab] = useState(authMode || 'login');
  const [errorStatus, setErrorStatus] = useState('');
  
  // Form States
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', role: 'client' 
  });
  const [adminData, setAdminData] = useState({ email: '', password: '' });
  
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authMode) {
      setActiveTab(authMode);
      setErrorStatus('');
    }
  }, [authMode]);

  const closeModal = () => {
    setSearchParams(params => {
      params.delete('auth');
      return params;
    });
    setErrorStatus('');
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const toggleMode = (mode) => {
    navigate(`${location.pathname}?auth=${mode}`, { replace: true });
  };

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
    setErrorStatus('');
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    setErrorStatus('');
  };

  const handleAdminChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
    setErrorStatus('');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(signInData);
      dispatch(addNotification({
        title: 'Login Successful',
        message: 'Welcome back! You are now logged in.',
        type: 'success',
      }));
      closeModal();
      
      // If an admin tries to login through standard portal, kick them to dashboard anyway, or admin?
      // standard login routes standardly
      navigate('/dashboard');
    } catch (error) {
      setErrorStatus(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorStatus('Passwords do not match');
      return;
    }
    try {
      const payload = {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        role: signUpData.role
      };
      await register(payload);
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      setErrorStatus(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      // standard login architecture supports standard creds
      await login(adminData);
      
      // We assume if they successfully authenticated here, we can route them to /admin.
      // The AdminDashboard component will handle kicking them out if their role isn't actually 'admin'.
      dispatch(addNotification({
        title: 'Admin Access Granted',
        message: 'Secure link established. Welcome to the Matrix.',
        type: 'success',
      }));
      closeModal();
      navigate('/admin');
    } catch (error) {
      setErrorStatus(error.response?.data?.message || 'Authentication rejected.');
    }
  };

  const handleBackdropClick = (e) => {
    // Only close on backdrop if NOT in admin mode (make admin mode feel strict)
    if (e.target === e.currentTarget && activeTab !== 'admin') closeModal();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${activeTab === 'admin' ? 'bg-[#050505]/90 backdrop-blur-xl' : 'bg-slate-900/40 backdrop-blur-md'}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-[850px] lg:max-w-[900px] overflow-hidden transform transition-all duration-500 scale-100 opacity-100 flex flex-col md:flex-row
          ${activeTab === 'admin' 
            ? 'bg-[#0a0a0a] rounded-[10px] shadow-[0_0_100px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/30' 
            : 'bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-1 ring-slate-900/10'}`}
        style={{ minHeight: activeTab === 'register' ? '620px' : '500px' }}
      >
        {/* Left Section - Hero Banner Light Aurora Theme (Hidden on Admin) */}
        {activeTab !== 'admin' ? (
          <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-500 p-12 flex-col justify-center items-start text-white overflow-hidden isolate shadow-inner">
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none -z-10">
              <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/40 filter blur-[80px] animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cyan-200/50 filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="relative z-10 w-full">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/30 backdrop-blur-md mb-6 shadow-sm">
                SkillServe Access
              </span>
              <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-md leading-[1.05]">
                Welcome <br/> <span className="text-cyan-100">Aboard!</span>
              </h1>
              <p className="text-sm sm:text-base text-blue-50 leading-relaxed font-bold drop-shadow-sm border-l-2 border-cyan-400 pl-4">
                Join the premiere platform connecting elite professionals with highly-valued clients. Secure, fast, and remarkably transparent.
              </p>
            </div>
          </div>
        ) : (
          /* Admin Left Banner - Obsidian UI */
          <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-[#050505] p-12 flex-col justify-center items-start text-white overflow-hidden isolate border-r border-white/5">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-2 mb-6 text-cyan-500">
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Restricted Area</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter text-white">
                <span className="text-slate-500 text-3xl font-normal block mb-1">Enter</span>
                SYSTEM // CORE
              </h1>
              <div className="h-0.5 w-12 bg-cyan-500 mt-8 mb-6 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.<br/>
                All verification attempts are logged and monitored.
              </p>
            </div>
          </div>
        )}

        {/* Right Section - Auth Forms */}
        <div className={`w-full relative flex flex-col justify-center transition-all duration-500 ease-in-out p-8 sm:p-12
          ${activeTab === 'admin' ? 'md:w-7/12 lg:w-1/2 bg-[#0a0a0a]' : 'md:w-7/12 lg:w-1/2 bg-white'}`}>
          
          {/* Close button */}
          <button 
            onClick={closeModal}
            className={`absolute top-6 right-6 p-2 rounded-full focus:outline-none transition-colors z-[110] border shadow-sm
              ${activeTab === 'admin' 
                ? 'text-slate-500 hover:text-white bg-transparent hover:bg-white/5 border-slate-800' 
                : 'text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-200 border-slate-200'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Error message banner */}
          <div className={`absolute top-0 left-0 w-full transition-all duration-300 z-50 ${errorStatus ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
            <div className={`px-6 py-4 shadow-sm border-b 
              ${activeTab === 'admin' ? 'bg-red-950/40 border-red-500/50' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm font-bold text-center uppercase tracking-wider 
                ${activeTab === 'admin' ? 'text-red-400' : 'text-red-600'}`}>
                {errorStatus}
              </p>
            </div>
          </div>

          <div className="relative w-full h-full flex flex-col pt-2">
            
            {/* Standard Header for mobile */}
            {activeTab !== 'admin' && (
              <div className="md:hidden text-center mb-8 relative">
                <div className="absolute inset-0 bg-blue-100/50 blur-xl rounded-full z-[-1]"></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  SkillServe
                </h2>
                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Sign in to continue</p>
              </div>
            )}

            <div className="relative w-full flex-grow flex items-center">
              
              {/* Sign In Form */}
              <div className={`transition-all duration-500 ease-in-out absolute top-1/2 -translate-y-1/2 left-0 w-full ${activeTab === 'login' ? 'opacity-100 translate-x-0 z-10 visible pointer-events-auto' : 'opacity-0 -translate-x-8 invisible pointer-events-none'}`}>
                <h3 className="text-3xl font-black text-slate-800 mb-8 hidden md:block tracking-tight">Sign In</h3>
                <form onSubmit={handleSignInSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
                    <input 
                      type="email" name="email" value={signInData.email} onChange={handleSignInChange} required 
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-inner text-slate-900 font-medium" 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Password</label>
                    <input 
                      type="password" name="password" value={signInData.password} onChange={handleSignInChange} required 
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-inner text-slate-900 font-medium" 
                      placeholder="••••••••" 
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded shadow-sm cursor-pointer transition-colors" />
                      <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-slate-600 cursor-pointer">Remember me</label>
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_10px_25px_rgba(37,99,235,0.25)] text-white font-black text-sm uppercase tracking-widest rounded-xl transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20">
                    Login to Account
                  </button>
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <p className="text-center text-sm font-bold text-slate-500">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => toggleMode('register')} className="font-black text-blue-600 hover:text-cyan-600 transition-colors bg-transparent border-0 uppercase tracking-widest text-[10px] ml-1">
                        Sign Up
                      </button>
                    </p>
                    <button type="button" onClick={() => toggleMode('admin')} className="mt-2 text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase tracking-widest transition-colors">
                      Administrator Portal
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Sign Up Form */}
              <div className={`transition-all duration-500 ease-in-out absolute top-1/2 -translate-y-1/2 left-0 w-full ${activeTab === 'register' ? 'opacity-100 translate-x-0 z-10 visible pointer-events-auto' : 'opacity-0 translate-x-8 invisible pointer-events-none'}`}>
                <h3 className="text-3xl font-black text-slate-800 mb-6 hidden md:block tracking-tight">Create Account</h3>
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} required 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-inner text-slate-900 font-medium" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Email Address</label>
                    <input 
                      type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} required 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-inner text-slate-900 font-medium" 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Password</label>
                      <input 
                        type="password" name="password" minLength="6" value={signUpData.password} onChange={handleSignUpChange} required 
                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-inner text-slate-900 font-medium" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Confirm</label>
                      <input 
                        type="password" name="confirmPassword" minLength="6" value={signUpData.confirmPassword} onChange={handleSignUpChange} required 
                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-inner text-slate-900 font-medium" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Account Type</label>
                    <select 
                      name="role" value={signUpData.role} onChange={handleSignUpChange} 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition-all duration-200 outline-none shadow-sm cursor-pointer text-slate-700 font-bold"
                    >
                      <option value="client">Client (Hire talent)</option>
                      <option value="professional">Professional (Offer services)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_10px_25px_rgba(37,99,235,0.25)] text-white font-black text-sm uppercase tracking-widest rounded-xl transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20">
                    Register Account
                  </button>
                  <p className="mt-6 text-center text-sm font-bold text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => toggleMode('login')} className="font-black text-blue-600 hover:text-cyan-600 transition-colors bg-transparent border-0 uppercase tracking-widest text-[10px] ml-1">
                      Sign In
                    </button>
                  </p>
                </form>
              </div>

              {/* OUTSTANDING OBSIDIAN ADMIN FORM */}
              <div className={`transition-all duration-500 ease-in-out absolute top-1/2 -translate-y-1/2 left-0 w-full ${activeTab === 'admin' ? 'opacity-100 translate-x-0 z-10 visible pointer-events-auto' : 'opacity-0 translate-x-8 invisible pointer-events-none'}`}>
                <h3 className="text-3xl font-black text-white mb-8 tracking-tighter">AUTHENTICATE</h3>
                <form onSubmit={handleAdminSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-500 mb-2 ml-1 uppercase tracking-widest opacity-80">Security Payload_ID</label>
                    <input 
                      type="email" name="email" value={adminData.email} onChange={handleAdminChange} required 
                      className="w-full px-5 py-4 bg-[#050505] text-white border border-[#222] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 outline-none font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                      placeholder="admin@sys.core" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-500 mb-2 ml-1 uppercase tracking-widest opacity-80">Security KEY</label>
                    <input 
                      type="password" name="password" value={adminData.password} onChange={handleAdminChange} required 
                      className="w-full px-5 py-4 bg-[#050505] text-white border border-[#222] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 outline-none font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                      placeholder="••••••••••••" 
                    />
                  </div>
                  <button type="submit" className="w-full mt-8 py-5 px-6 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-[#000] border border-cyan-500/50 font-black text-xs uppercase tracking-[0.2em] transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] focus:outline-none">
                    Execute Subroutine
                  </button>
                  <p className="mt-8 text-center text-[10px] font-mono text-slate-600 tracking-widest">
                    <button type="button" onClick={() => toggleMode('login')} className="hover:text-cyan-400 transition-colors uppercase">
                      {'< Return to Client Portal'}
                    </button>
                  </p>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
