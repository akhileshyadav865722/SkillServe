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
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

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

  useEffect(() => {
    const fetchReviews = async () => {
      if (userProfile?.role === 'professional') {
        setLoadingReviews(true);
        try {
          const res = await api.get(`/users/${userProfile._id}/reviews`);
          setReviews(res.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoadingReviews(false);
        }
      }
    };
    if (userProfile) fetchReviews();
  }, [userProfile]);

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
    <div className="flex justify-center items-center min-h-[50vh] bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !userProfile) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
        <h3 className="text-2xl font-black text-slate-800 mb-4">{error || 'User not found'}</h3>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-slate-50 text-blue-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen font-sans pb-20 relative isolate">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-16 sm:pt-24">
        
        {/* Navigation Back */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-black text-slate-600 hover:text-blue-700 transition-colors bg-white px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm w-max">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Directory
          </button>
        </div>

        {/* Main Profile Card Container - Solid White Theme */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden mb-8">
          
          {/* Header Banner Inside Card */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-200 w-full relative"></div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-24 mb-10 relative">
              <div className="relative shrink-0 self-start sm:self-auto">
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[32px] bg-white shadow-lg p-2 border-4 border-white transition-transform hover:scale-105">
                  {userProfile.profileImage ? (
                    <img src={`${BASE_URL}${userProfile.profileImage}`} alt={userProfile.name} className="w-full h-full object-cover rounded-[24px] bg-slate-100" />
                  ) : (
                    <div className="w-full h-full rounded-[24px] bg-slate-100 flex items-center justify-center text-6xl font-black text-slate-300 shadow-inner">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
                    {userProfile.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-1.5 text-xs font-black text-blue-700 uppercase tracking-widest border border-blue-100 shadow-sm">
                      {userProfile.role}
                    </span>
                    <span className="text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      Joined {new Date(userProfile.createdAt || Date.now()).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Chat CTA Button */}
                {user && user._id !== id && (
                  <button
                    onClick={handleStartChat}
                    disabled={isChatStarting}
                    className="inline-flex items-center justify-center px-10 py-4 font-black text-white transition-all bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-1 focus:outline-none w-full sm:w-auto self-start sm:self-auto uppercase tracking-wider text-lg"
                  >
                     <span className="flex items-center gap-2">
                        {isChatStarting ? (
                          'Starting...'
                        ) : (
                          <>
                            <svg className="w-6 h-6 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Message
                          </>
                        )}
                     </span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column (Main Info) */}
              <div className="lg:col-span-2 space-y-10">
                {/* About Section */}
                <section>
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-5">
                    <div className="bg-blue-50 text-blue-500 p-2 rounded-xl shadow-sm border border-blue-100">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    Professional Bio
                  </h2>
                  <div className="text-slate-600 leading-relaxed font-bold bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                    {userProfile.bio ? userProfile.bio : <span className="text-slate-400 italic">This user hasn't written a professional summary yet.</span>}
                  </div>
                </section>

                {/* Reviews Section */}
                {userProfile.role === 'professional' && (
                  <section>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-5">
                      <div className="bg-yellow-50 text-yellow-500 p-2 rounded-xl shadow-sm border border-yellow-100">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                      Feedback Wall
                    </h2>
                    
                    {loadingReviews ? (
                      <div className="flex py-6 justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                        <span className="block text-4xl mb-3">🌟</span>
                        <p className="text-slate-500 font-black">No feedback mounted yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {reviews.map(rev => (
                          <div key={rev._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-5 transition-transform hover:-translate-y-1">
                            <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2">
                              <div className="h-16 w-16 rounded-[16px] bg-slate-50 flex items-center justify-center text-blue-600 font-black text-2xl border border-slate-200 shadow-sm transition-transform">
                                {rev.reviewer?.name?.charAt(0)}
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-1">
                                {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <div className="flex text-yellow-400 mb-2 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`h-5 w-5 ${i < rev.rating ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-lg">{rev.reviewer?.name}</h4>
                              <p className="text-slate-600 mt-2 font-bold bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">"{rev.review}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>

              {/* Right Sidebar Details */}
              <div className="space-y-6">
                
                {/* Contact Block */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Credentials
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                      <p className="text-slate-800 font-bold break-all">{userProfile.email || <span className="text-slate-400 italic">Hidden</span>}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                      <p className="text-slate-800 font-bold">{userProfile.phone || <span className="text-slate-400 italic">Not set</span>}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">HQ Location</span>
                      <p className="text-slate-800 font-bold">{userProfile.location || <span className="text-slate-400 italic">Not set</span>}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Metrics */}
                {userProfile.role === 'professional' && (
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <h3 className="text-xs font-black text-white/80 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
                      <svg className="w-5 h-5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      Performance
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                        <span className="block text-3xl font-black text-white">{userProfile.experience || 0}</span>
                        <span className="text-[9px] uppercase font-black text-white/70 tracking-wider">Years Exp</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                        <span className="block text-3xl font-black text-white flex items-center justify-center gap-1">
                          {userProfile.rating || 0} <svg className="w-5 h-5 text-yellow-300 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </span>
                        <span className="text-[9px] uppercase font-black text-white/70 tracking-wider">Rating</span>
                      </div>
                    </div>

                    <div className="mb-6 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider mb-2 block">Skill Registry</span>
                      {userProfile.skills && userProfile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userProfile.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black rounded-lg shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-white/60 italic text-sm font-bold">No skills tracked</span>
                      )}
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider mb-2 block">Resume Document</span>
                      <div>
                        {userProfile.resume ? (
                          <a href={`${BASE_URL}${userProfile.resume}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white font-black text-sm hover:text-cyan-200 transition-colors bg-white/10 px-4 py-2 rounded-xl border border-white/20 w-full justify-center mt-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            View Resume
                          </a>
                        ) : (
                          <span className="text-white/60 italic text-sm font-bold">No resume</span>
                        )}
                      </div>
                    </div>

                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
