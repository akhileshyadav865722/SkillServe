import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { setCurrentChat } from '../store/chatSlice';

function UserProfile() {
  const { userId: id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatStarting, setIsChatStarting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUserProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('?auth=login');
      return;
    }
    if (!id) return;

    setIsChatStarting(true);
    try {
      const res = await api.post('/chat/conversation/create', { userId: id });
      dispatch(setCurrentChat(res.data));
      navigate('/chat');
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setIsChatStarting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !userProfile) return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{error || 'User not found'}</h3>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl mt-4">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50 min-h-screen py-16 font-sans relative overflow-hidden">
      
      {/* Ambient Animated Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-100/40 to-transparent pointer-events-none z-0"></div>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse-slow pointer-events-none z-0"></div>
      <div className="absolute top-64 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex justify-start mb-10 relative z-20">
          <button onClick={() => navigate(-1)} className="group flex items-center text-sm font-black text-indigo-400 hover:text-indigo-600 transition-colors bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white shadow-sm hover:shadow-md hover:-translate-x-1 duration-300">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Directory
          </button>
        </div>

        {/* Full-width seamless header area */}
        <div className="relative mb-16 px-4">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end relative z-10 w-full">
            {/* Profile Avatar */}
            <div className="relative shrink-0 transition-transform duration-500 hover:scale-105 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300 to-cyan-300 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow -z-10"></div>
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white shadow-xl shadow-indigo-100 p-2 overflow-hidden border-4 border-white">
                {userProfile.profileImage ? (
                  <img src={`${BASE_URL}${userProfile.profileImage}`} alt={userProfile.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center text-6xl font-black text-indigo-300">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Headers */}
            <div className="flex-1 pb-4 w-full">
              <h1 className="text-4xl sm:text-6xl font-black text-gray-800 tracking-tight leading-none mb-3 drop-shadow-sm">
                {userProfile.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-1.5 text-sm font-black text-teal-600 ring-1 ring-inset ring-teal-200/60 capitalize shadow-sm">
                  {userProfile.role}
                </span>
                <span className="text-indigo-400 font-bold text-sm bg-indigo-50/50 px-3 py-1 rounded-lg">
                  Member since {new Date(userProfile.createdAt || Date.now()).getFullYear()}
                </span>
              </div>
            </div>

            {/* Chat CTA Button */}
            {user && user._id !== id && (
              <div className="pb-4 sm:shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleStartChat}
                  disabled={isChatStarting}
                  className="group relative inline-flex w-full sm:w-auto items-center justify-center px-10 py-4 font-black text-white transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl hover:scale-[1.02] hover:-translate-y-1 shadow-lg shadow-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 border-0"
                >
                  <span className="flex items-center gap-2">
                    {isChatStarting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-100" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        Start Conversation
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Spanning full space */}
        <div className="space-y-16 px-4">
          
          {/* About / Bio Section */}
          <section className="relative group border-b border-indigo-100 pb-12">
            <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Bio / About
            </h2>
            <div className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed font-serif bg-white/40 p-6 rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              {userProfile.bio ? userProfile.bio : <span className="text-gray-400 italic">This user hasn't written a bio yet.</span>}
            </div>
          </section>

          {/* Contact Details Grid */}
          <section className="border-b border-indigo-100 pb-12">
            <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-8">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {/* Email */}
              <div className="group">
                <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">Email Address</dt>
                <dd className="text-lg font-black text-gray-800 break-words group-hover:text-indigo-600 transition-colors">{userProfile.email || <span className="text-indigo-200 italic text-base">Hidden</span>}</dd>
              </div>

              {/* Phone */}
              <div className="group">
                <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">Phone Number</dt>
                <dd className="text-lg font-black text-gray-800 break-words group-hover:text-indigo-600 transition-colors">
                  {userProfile.phone || <span className="text-indigo-200 italic text-base">Not provided</span>}
                </dd>
              </div>

              {/* Location */}
              <div className="group">
                <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">Location</dt>
                <dd className="text-lg font-black text-gray-800 break-words whitespace-normal group-hover:text-cyan-600 transition-colors">
                  {userProfile.location || <span className="text-cyan-200 italic text-base">Not provided</span>}
                </dd>
              </div>
            </div>
          </section>

          {/* Professional Only Sections */}
          {userProfile.role === 'professional' && (
            <section className="space-y-16">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 border-b border-indigo-100 pb-12">
                <div>
                  <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">Experience</dt>
                  <dd className="text-2xl font-black text-gray-800">{userProfile.experience} <span className="text-base font-bold text-indigo-400">years</span></dd>
                </div>
                <div>
                  <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">User Rating</dt>
                  <dd className="flex items-center text-2xl font-black text-gray-800">
                    <svg className="text-amber-400 h-6 w-6 mr-2 drop-shadow-sm animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {userProfile.rating} <span className="text-indigo-300 text-base font-bold ml-2">/ 5.0</span>
                  </dd>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    Core Skills
                  </h2>
                  {userProfile.skills && userProfile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {userProfile.skills.map((skill, index) => (
                        <span key={index} className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white text-indigo-700 hover:text-indigo-900 font-bold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-indigo-300 italic font-medium">No skills listed</span>
                  )}
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Resume / CV
                  </h2>
                  {userProfile.resume ? (
                    <div className="flex items-center gap-4 bg-white/40 p-4 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-indigo-100/50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <div>
                        <a href={`${BASE_URL}${userProfile.resume}`} target="_blank" rel="noopener noreferrer" className="font-black text-indigo-600 hover:text-indigo-800 tracking-wide text-sm underline decoration-indigo-200 underline-offset-4 mb-2 block">
                          Download Document
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/40 p-6 rounded-3xl border border-white shadow-sm">
                      <span className="text-indigo-300 italic block font-medium">No document available.</span>
                    </div>
                  )}
                </div>
              </div>

            </section>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserProfile;