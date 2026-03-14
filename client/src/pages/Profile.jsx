import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data: imagePath } = await axios.post('http://localhost:5000/api/upload', formData, config);
      
      const res = await axios.put('http://localhost:5000/api/auth/profile', { profileImage: imagePath });
      setUser(res.data);
    } catch (error) {
      console.error(error);
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
      const { data: resumePath } = await axios.post('http://localhost:5000/api/upload', formData, config);
      
      const res = await axios.put('http://localhost:5000/api/auth/profile', { resume: resumePath });
      setUser(res.data);
    } catch (error) {
      console.error(error);
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
          const res = await axios.get(`http://localhost:5000/api/users/${user._id}/reviews`);
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card mb-10">
        <div className="bg-gradient-to-r from-slate-800 to-primary-900 px-6 py-10 sm:p-12 text-center relative overflow-hidden">
          {/* Decorative mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="relative mx-auto h-24 w-24 rounded-full bg-white mb-4 shadow-md group">
            {user.profileImage ? (
              <img src={`http://localhost:5000${user.profileImage}`} alt={user.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-4xl font-bold text-primary-600 rounded-full">
                {user.name.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity text-xs font-medium">
              {uploadingImage ? '...' : 'Upload'}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
          <p className="text-primary-100 font-medium capitalize mt-1">{user.role}</p>
        </div>
        
        <div className="px-6 py-8 sm:p-10">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email Address</dt>
              <dd className="mt-1 text-base text-gray-900">{user.email}</dd>
            </div>
            
            {user.role === 'professional' && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience</dt>
                  <dd className="mt-1 text-base text-gray-900">{user.experience} years</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Aggregate Rating</dt>
                  <dd className="mt-1 flex items-center text-base text-gray-900 font-medium">
                    <svg className="text-yellow-400 h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {user.rating} / 5
                  </dd>
                </div>
                
                {user.skills && user.skills.length > 0 && (
                  <div className="sm:col-span-2 mt-2">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Registered Skills</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <li key={index} className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Resume / CV</dt>
                  <dd className="mt-1 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center min-w-0">
                      <svg className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {user.resume ? (
                        <a href={`http://localhost:5000${user.resume}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline truncate bg-white px-3 py-1.5 rounded-md border border-primary-100">
                          View Uploaded Resume
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500 italic">No resume uploaded yet</span>
                      )}
                    </div>
                    <label className="cursor-pointer ml-4 flex-shrink-0 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                      {uploadingResume ? 'Uploading...' : 'Upload New'}
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingResume} />
                    </label>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>
      
      {user.role === 'professional' && (
        <div className="mt-8 pt-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-6">
            <h3 className="text-xl font-bold leading-6 text-gray-900">Client Reviews</h3>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
              {user.numReviews || 0} reviews
            </span>
          </div>
          
          {loadingReviews ? (
             <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
             </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.53a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">Reviews from clients will appear here after completing jobs.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(rev => (
                <div key={rev._id} className="card p-6 flex gap-5">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    {rev.reviewer?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{rev.reviewer?.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Project: {rev.request?.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="flex text-yellow-500">
                           {[...Array(5)].map((_, i) => (
                             <svg key={i} className={`h-4 w-4 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                             </svg>
                           ))}
                         </div>
                         <span className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3 py-1">"{rev.review}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
