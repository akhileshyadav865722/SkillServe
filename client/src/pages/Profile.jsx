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
    fetchReviews();
  }, [user]);

  if (!user) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50 min-h-screen py-16 font-sans relative overflow-hidden">
      
      {/* Ambient Animated Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-100/40 to-transparent pointer-events-none z-0"></div>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse-slow pointer-events-none z-0"></div>
      <div className="absolute top-64 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Full-width seamless header area */}
        <div className="relative mb-16 px-4">
          <div className="flex gap-8 items-end relative z-10">
            {/* Profile Avatar */}
            <div className="relative shrink-0 transition-transform duration-500 hover:scale-105 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300 to-cyan-300 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow -z-10"></div>
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white shadow-xl shadow-indigo-100 p-2 overflow-hidden border-4 border-white">
                {user.profileImage ? (
                  <img src={`${BASE_URL}${user.profileImage}`} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center text-6xl font-black text-indigo-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Upload Overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm text-indigo-600 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 font-black tracking-widest uppercase text-sm rounded-full m-2 border-2 border-indigo-200 border-dashed">
                  {uploadingImage ? '...' : 'Update'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
            </div>

            {/* Profile Headers */}
            <div className="flex-1 pb-4">
              <h1 className="text-4xl sm:text-6xl font-black text-gray-800 tracking-tight leading-none mb-3 drop-shadow-sm">
                {user.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-1.5 text-sm font-black text-teal-600 ring-1 ring-inset ring-teal-200/60 capitalize shadow-sm">
                  {user.role}
                </span>
                <span className="text-indigo-400 font-bold text-sm bg-indigo-50/50 px-3 py-1 rounded-lg">
                  Member since {new Date(user.createdAt || Date.now()).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Spanning the space smoothly */}
        <div className="space-y-16 px-4">
          
          {/* About / Bio Section */}
          <section className="relative group border-b border-indigo-100 pb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Bio / About
              </h2>
              <button onClick={() => isEditingBio ? handleUpdateField('bio', bioInput, setIsEditingBio) : setIsEditingBio(true)} className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                {isEditingBio ? 'Save Changes' : 'Edit Bio'}
              </button>
            </div>
            
            {isEditingBio ? (
              <textarea 
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows="4"
                placeholder="Tell us a little about yourself, your background, and what you're looking for..."
                className="w-full bg-white/80 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl p-6 text-gray-700 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 shadow-inner transition-all"
                autoFocus
              ></textarea>
            ) : (
              <div className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed font-serif bg-white/40 p-6 rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                {user.bio ? user.bio : <span className="text-gray-400 italic">No bio provided. Write a little about yourself to stand out!</span>}
              </div>
            )}
          </section>

          {/* Contact Details Vertical Split */}
          <section className="border-b border-indigo-100 pb-12">
            <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-8">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {/* Email */}
              <div className="group">
                <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">Email Address</dt>
                <dd className="text-lg font-black text-gray-800 break-words group-hover:text-indigo-600 transition-colors">{user.email}</dd>
              </div>

              {/* Phone */}
              <div className="group">
                <dt className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">Phone Number</span>
                  <button onClick={() => isEditingPhone ? handleUpdateField('phone', phoneInput, setIsEditingPhone) : setIsEditingPhone(true)} className="text-[10px] font-black text-white bg-indigo-300 hover:bg-indigo-400 px-3 py-1 rounded-full uppercase shadow-sm transition-colors">
                    {isEditingPhone ? 'Save' : 'Edit'}
                  </button>
                </dt>
                <dd className="text-lg font-black text-gray-800">
                  {isEditingPhone ? (
                     <input type="text" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-white border-2 border-indigo-100 rounded-xl p-2.5 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-inner font-bold" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleUpdateField('phone', phoneInput, setIsEditingPhone)} />
                  ) : (
                    <span className="group-hover:text-indigo-600 transition-colors">{user.phone || <span className="text-indigo-200 italic text-base">Not provided</span>}</span>
                  )}
                </dd>
              </div>

              {/* Location */}
              <div className="group">
                <dt className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">Location</span>
                  <button onClick={() => isEditingLocation ? handleUpdateField('location', locationInput, setIsEditingLocation) : setIsEditingLocation(true)} className="text-[10px] font-black text-white bg-cyan-300 hover:bg-cyan-400 px-3 py-1 rounded-full uppercase shadow-sm transition-colors">
                    {isEditingLocation ? 'Save' : 'Edit'}
                  </button>
                </dt>
                <dd className="text-lg font-black text-gray-800 break-words whitespace-normal">
                  {isEditingLocation ? (
                     <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="e.g. New York, USA" className="w-full bg-white border-2 border-cyan-100 rounded-xl p-2.5 focus:ring-4 focus:ring-cyan-100 outline-none transition-all shadow-inner font-bold" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleUpdateField('location', locationInput, setIsEditingLocation)} />
                  ) : (
                    <span className="group-hover:text-cyan-600 transition-colors">{user.location || <span className="text-cyan-200 italic text-base">Not provided</span>}</span>
                  )}
                </dd>
              </div>
            </div>
          </section>

          {/* Professional Only Sections */}
          {user.role === 'professional' && (
            <section className="space-y-16">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 border-b border-indigo-100 pb-12">
                <div>
                  <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">Experience</dt>
                  <dd className="text-2xl font-black text-gray-800">{user.experience} <span className="text-base font-bold text-indigo-400">years</span></dd>
                </div>
                <div>
                  <dt className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">User Rating</dt>
                  <dd className="flex items-center text-2xl font-black text-gray-800">
                    <svg className="text-amber-400 h-6 w-6 mr-2 drop-shadow-sm animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {user.rating} <span className="text-indigo-300 text-base font-bold ml-2">/ 5.0</span>
                  </dd>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-indigo-100 pb-12">
                <div className="lg:col-span-2">
                  <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    Core Skills
                  </h2>
                  {user.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white text-indigo-700 hover:text-indigo-900 font-bold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-indigo-300 italic font-medium">No skills listed yet.</span>
                  )}
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Resume / CV
                  </h2>
                  {user.resume ? (
                    <div className="flex items-center gap-4 bg-white/40 p-4 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-indigo-100/50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <div>
                        <a href={`${BASE_URL}${user.resume}`} target="_blank" rel="noopener noreferrer" className="font-black text-indigo-600 hover:text-indigo-800 tracking-wide text-sm underline decoration-indigo-200 underline-offset-4 mb-2 block">
                          Download Document
                        </a>
                        <label className="cursor-pointer text-[10px] font-black text-white bg-cyan-400 hover:bg-cyan-500 uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm transition-colors mt-2">
                          {uploadingResume ? 'Wait...' : 'Update File'}
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingResume} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/40 p-6 rounded-3xl border border-white shadow-sm">
                      <span className="text-indigo-300 italic block mb-4 font-medium">No document uploaded.</span>
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 font-black py-2.5 px-6 rounded-xl hover:bg-indigo-100 hover:-translate-y-0.5 shadow-sm transition-all text-sm uppercase tracking-wider">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        {uploadingResume ? 'Uploading...' : 'Upload Now'}
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingResume} />
                      </label>
                    </div>
                  )}
                </div>
              </div>

            </section>
          )}

          {/* Reviews Section */}
          {user.role === 'professional' && (
            <section className="pt-6">
              <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-4">
                <span className="bg-gradient-to-tr from-amber-400 to-orange-400 text-white p-3 rounded-2xl shadow-lg shadow-amber-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </span>
                Client Reviews
              </h2>
              
              {loadingReviews ? (
                <div className="flex py-10 justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-cyan-400"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-16 bg-white/40 rounded-[3rem] text-center border border-white shadow-sm">
                  <span className="text-6xl drop-shadow-sm opacity-50 block mb-6 animate-bounce">💬</span>
                  <h3 className="text-2xl font-black text-gray-700 mb-2">No feedback yet</h3>
                  <p className="text-indigo-400 font-bold">Reviews from completed jobs will blossom here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(rev => (
                    <div key={rev._id} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col sm:flex-row gap-6 transition-all duration-300">
                      <div className="shrink-0 text-center">
                        <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center text-indigo-500 font-black text-2xl mb-2 shadow-inner border border-white">
                          {rev.reviewer?.name?.charAt(0)}
                        </div>
                        <span className="text-xs font-black text-indigo-300 bg-indigo-50 px-2 py-1 rounded-lg block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <div className="flex text-amber-400 mb-3 drop-shadow-sm">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-5 w-5 ${i < rev.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-black text-xl text-gray-800 mb-2 flex items-center gap-2">
                          {rev.reviewer?.name}
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">Client</span>
                        </h4>
                        <p className="text-gray-600 font-medium leading-relaxed italic text-lg opacity-90">"{rev.review}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
