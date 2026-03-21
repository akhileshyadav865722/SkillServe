import { useContext, useEffect, useState } from 'react';
import api, { BASE_URL } from '../api/axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Field Edit States
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');

  useEffect(() => {
    if (user) {
      setLocationInput(user.location || '');
      setPhoneInput(user.phone || '');
      setBioInput(user.bio || '');
    }
  }, [user]);

  const handleUpdateField = async (field, value, setter) => {
    try {
      const res = await api.put('/auth/profile', { [field]: value });
      setUser(res.data);
      setter(false);
    } catch (error) {
      console.error(error);
      alert(`Failed to update ${field}`);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data: imagePath } = await api.post('/upload', formData, config);
      const res = await api.put('/auth/profile', { profileImage: imagePath });
      setUser(res.data);
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingResume(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data: resumePath } = await api.post('/upload', formData, config);
      const res = await api.put('/auth/profile', { resume: resumePath });
      setUser(res.data);
    } catch (error) {
      alert('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (user?.role === 'professional') {
        setLoadingReviews(true);
        try {
          const res = await api.get(`/users/${user._id}/reviews`);
          setReviews(res.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoadingReviews(false);
        }
      }
    };
    if (user) fetchReviews();
  }, [user]);

  if (!user) return (
    <div className="flex justify-center items-center min-h-[50vh] bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen font-sans pb-20 relative isolate">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-16 sm:pt-24">
        
        {/* Main Profile Card Container - Solid Single Color (White) */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden mb-8">
          
          {/* Header Banner Inside Card */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-200 w-full relative"></div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-24 mb-10 relative">
              <div className="relative group shrink-0 self-start sm:self-auto">
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[32px] bg-white shadow-lg p-2 border-4 border-white">
                  {user.profileImage ? (
                    <img src={`${BASE_URL}${user.profileImage}`} alt={user.name} className="w-full h-full object-cover rounded-[24px] bg-slate-100" />
                  ) : (
                    <div className="w-full h-full rounded-[24px] bg-slate-100 flex items-center justify-center text-6xl font-black text-slate-300 shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Upload Overlay */}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 font-bold uppercase tracking-wider text-sm rounded-[24px] m-2">
                    {uploadingImage ? '...' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              <div className="flex-1 pb-4">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-1.5 text-xs font-black text-blue-700 uppercase tracking-widest border border-blue-100 shadow-sm">
                    {user.role}
                  </span>
                  <span className="text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    Joined {new Date(user.createdAt || Date.now()).getFullYear()}
                  </span>
                </div>
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
                  <div className="text-slate-600 leading-relaxed font-bold bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                    {isEditingBio ? (
                      <div className="animate-in fade-in duration-300">
                        <textarea className="w-full bg-white rounded-xl border border-blue-200 p-4 focus:ring-2 focus:ring-blue-400 font-bold text-slate-700 shadow-inner" rows={4} value={bioInput} onChange={e => setBioInput(e.target.value)} />
                        <div className="flex gap-3 justify-end mt-4">
                          <button onClick={() => setIsEditingBio(false)} className="px-5 py-2.5 text-sm font-black text-slate-500 hover:text-slate-700 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm">Cancel</button>
                          <button onClick={() => handleUpdateField('bio', bioInput, setIsEditingBio)} className="px-7 py-2.5 text-sm font-black text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Save Bio</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {user.bio ? user.bio : <span className="text-slate-400 italic">Spice up your profile visually by writing a short bio about what you do beautifully!</span>}
                        <button onClick={() => setIsEditingBio(true)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                </section>

                {/* Reviews Section */}
                {user.role === 'professional' && (
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
                      <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <span className="block text-4xl mb-3">🌟</span>
                        <p className="text-slate-500 font-black">No reviews mounted yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {reviews.map(rev => (
                          <div key={rev._id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row gap-5">
                            <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2">
                              <div className="h-16 w-16 rounded-[16px] bg-slate-50 flex items-center justify-center text-blue-600 font-black text-2xl border border-slate-200">
                                {rev.reviewer?.name?.charAt(0)}
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-1">
                                {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <div className="flex text-yellow-400 mb-2 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`h-5 w-5 ${i < rev.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-lg">{rev.reviewer?.name}</h4>
                              <p className="text-slate-600 mt-2 font-bold bg-slate-50 p-4 rounded-xl border border-slate-100">"{rev.review}"</p>
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
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Credentials
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</span>
                      <p className="text-slate-800 font-bold break-all mt-1">{user.email || 'Hidden'}</p>
                    </div>

                    <div className="group relative bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                      {isEditingPhone ? (
                        <div className="flex items-center gap-2">
                           <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 focus:ring-blue-500" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} />
                           <button onClick={() => handleUpdateField('phone', phoneInput, setIsEditingPhone)} className="text-emerald-600 hover:text-white hover:bg-emerald-500 bg-emerald-100 p-2 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></button>
                           <button onClick={() => setIsEditingPhone(false)} className="text-slate-500 hover:text-slate-700 bg-white shadow-sm border border-slate-200 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                           <p className="text-slate-800 font-bold">{user.phone || <span className="text-slate-400 italic">Not set</span>}</p>
                           <button onClick={() => setIsEditingPhone(true)} className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity bg-blue-50 p-1.5 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        </div>
                      )}
                    </div>

                    <div className="group relative bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">HQ Location</span>
                      {isEditingLocation ? (
                        <div className="flex items-center gap-2">
                           <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 focus:ring-blue-500" value={locationInput} onChange={e=>setLocationInput(e.target.value)} />
                           <button onClick={() => handleUpdateField('location', locationInput, setIsEditingLocation)} className="text-emerald-600 hover:text-white hover:bg-emerald-500 bg-emerald-100 p-2 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></button>
                           <button onClick={() => setIsEditingLocation(false)} className="text-slate-500 hover:text-slate-700 bg-white shadow-sm border border-slate-200 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                           <p className="text-slate-800 font-bold">{user.location || <span className="text-slate-400 italic">Not set</span>}</p>
                           <button onClick={() => setIsEditingLocation(true)} className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity bg-blue-50 p-1.5 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Metrics */}
                {user.role === 'professional' && (
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <h3 className="text-xs font-black text-white/80 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
                      <svg className="w-5 h-5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      Performance
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                        <span className="block text-3xl font-black text-white">{user.experience || 0}</span>
                        <span className="text-[9px] uppercase font-black text-white/70 tracking-wider">Years Exp</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                        <span className="block text-3xl font-black text-white flex items-center justify-center gap-1">
                          {user.rating || 0} <svg className="w-5 h-5 text-yellow-300 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </span>
                        <span className="text-[9px] uppercase font-black text-white/70 tracking-wider">Rating</span>
                      </div>
                    </div>

                    <div className="mb-6 relative z-10">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider mb-2 block">Skill Registry</span>
                      {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
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
                      <div className="flex items-center justify-between">
                        {user.resume ? (
                          <a href={`${BASE_URL}${user.resume}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white font-black text-sm hover:text-cyan-200 transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            View
                          </a>
                        ) : (
                          <span className="text-white/60 italic text-sm font-bold">No resume</span>
                        )}
                        <label className="text-white bg-blue-500/50 hover:bg-blue-400 cursor-pointer transition-colors p-2 rounded-lg backdrop-blur-sm" title="Upload New Resume">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingResume} />
                        </label>
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

export default Profile;
