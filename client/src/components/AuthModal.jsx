import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AuthModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authMode = searchParams.get('auth');
  const isOpen = !!authMode;
  
  const [isLogin, setIsLogin] = useState(authMode === 'login');
  const [errorStatus, setErrorStatus] = useState('');
  
  // Form States
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', role: 'client' 
  });
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authMode) {
      setIsLogin(authMode === 'login');
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

  const toggleMode = () => {
    navigate(`${location.pathname}?auth=${isLogin ? 'register' : 'login'}`, { replace: true });
  };

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
    setErrorStatus('');
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    setErrorStatus('');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(signInData);
      closeModal();
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-[850px] lg:max-w-[900px] bg-white backdrop-blur-3xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 scale-100 opacity-100 flex flex-col md:flex-row"
        style={{ minHeight: isLogin ? '500px' : '620px' }}
      >
        {/* Left Section - Hero Banner */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-10 flex-col justify-center items-start text-white overflow-hidden">
          {/* Abstract decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white filter blur-[60px]"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-300 filter blur-[60px]"></div>
          </div>
          
          <div className="relative z-10 w-full pr-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-sm">Welcome!</h1>
            <h2 className="text-xl lg:text-2xl font-medium mb-6 text-white/90">Welcome to our platform</h2>
            <p className="text-base text-white/80 leading-relaxed font-medium">
              Join the leading platform connecting top-rated professionals with clients looking to get projects done. Secure, fast, and transparent.
            </p>
          </div>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="w-full md:w-7/12 lg:w-1/2 relative bg-white flex flex-col justify-center transition-all duration-500 ease-in-out p-8 sm:p-10">
          
          {/* Close button */}
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 rounded-full p-1.5 focus:outline-none transition-colors z-[110]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Error message banner */}
          <div className={`absolute top-0 left-0 w-full transition-all duration-300 z-50 ${errorStatus ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
            <div className="bg-red-50 border-b border-red-200 px-6 py-3 shadow-sm">
              <p className="text-sm text-red-600 font-bold text-center">
                {errorStatus}
              </p>
            </div>
          </div>

          <div className="relative w-full h-full flex flex-col pt-2">
            
            {/* Header for mobile (hidden on desktop since left side covers it) */}
            <div className="md:hidden text-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome!
              </h2>
              <p className="text-gray-600 font-medium mt-1">Sign in or create an account</p>
            </div>

            <div className="relative w-full flex-grow">
              {/* Sign In Form */}
              <div className={`transition-all duration-500 ease-in-out absolute top-0 left-0 w-full ${isLogin ? 'opacity-100 translate-x-0 z-10 visible pointer-events-auto' : 'opacity-0 -translate-x-8 invisible pointer-events-none'}`}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">Sign In</h3>
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={signInData.email} 
                      onChange={handleSignInChange} 
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm text-gray-800" 
                      placeholder="you@example.com" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={signInData.password} 
                      onChange={handleSignInChange} 
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm text-gray-800" 
                      placeholder="••••••••" 
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center">
                      <input 
                        id="remember-me" 
                        name="remember-me" 
                        type="checkbox" 
                        className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded cursor-pointer transition-colors" 
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-600 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/30 text-white font-extrabold rounded-xl transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 tracking-wide"
                  >
                    Login
                  </button>
                  
                  <p className="mt-6 text-center text-sm font-medium text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={toggleMode} 
                      className="font-extrabold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors bg-transparent border-0"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              </div>
              
              {/* Sign Up Form */}
              <div className={`transition-all duration-500 ease-in-out absolute top-0 left-0 w-full ${!isLogin ? 'opacity-100 translate-x-0 z-10 visible pointer-events-auto' : 'opacity-0 translate-x-8 invisible pointer-events-none'}`}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">Create Account</h3>
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={signUpData.name} 
                      onChange={handleSignUpChange} 
                      required 
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm text-gray-800" 
                      placeholder="John Doe" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={signUpData.email} 
                      onChange={handleSignUpChange} 
                      required 
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm text-gray-800" 
                      placeholder="you@example.com" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                      <input 
                        type="password" 
                        name="password" 
                        minLength="6" 
                        value={signUpData.password} 
                        onChange={handleSignUpChange} 
                        required 
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm text-gray-800" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Confirm</label>
                      <input 
                        type="password" 
                        name="confirmPassword" 
                        minLength="6" 
                        value={signUpData.confirmPassword} 
                        onChange={handleSignUpChange} 
                        required 
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm text-gray-800" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  {/* Required Role selection inherited for logical integrity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Account Type</label>
                    <select 
                      name="role" 
                      value={signUpData.role} 
                      onChange={handleSignUpChange} 
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all duration-200 outline-none shadow-sm cursor-pointer text-gray-800 font-medium"
                    >
                      <option value="client">Client (Hire talent)</option>
                      <option value="professional">Professional (Offer services)</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/30 text-white font-extrabold rounded-xl transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 tracking-wide"
                  >
                    Create Account
                  </button>
                  
                  <p className="mt-4 text-center text-sm font-medium text-gray-600">
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      onClick={toggleMode} 
                      className="font-extrabold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors bg-transparent border-0"
                    >
                      Sign In
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
