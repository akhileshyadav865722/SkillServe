import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUserProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (error || !userProfile) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{error || 'User not found'}</h3>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="bg-white shadow-lg shadow-gray-100/50 rounded-2xl overflow-hidden mb-8 border border-gray-100 transition-hover">
        <div className="bg-gradient-to-br from-slate-800 to-indigo-900 px-6 py-10 sm:p-12 text-center relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary-500 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 mx-auto h-28 w-28 rounded-full bg-white mb-5 shadow-xl border-4 border-white/20 group">
            {userProfile.profileImage ? (
              <img src={`http://localhost:5000${userProfile.profileImage}`} alt={userProfile.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-5xl font-bold text-primary-600 rounded-full">
                {userProfile.name.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="relative z-10 text-3xl font-bold text-white tracking-tight">{userProfile.name}</h2>
          <span className="relative z-10 inline-block mt-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white font-medium text-sm border border-white/20 capitalize tracking-wide shadow-sm">
            {userProfile.role}
          </span>
        </div>
        
        {/* Profile Info Details */}
        <div className="px-6 py-8 sm:p-10 bg-white">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            <div>
              <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Member Since</dt>
              <dd className="mt-2 text-base text-gray-900 font-medium">{new Date(userProfile.createdAt).toLocaleDateString()}</dd>
            </div>
            
            {userProfile.role === 'professional' && (
              <>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Experience</dt>
                  <dd className="mt-2 text-base text-gray-900 font-medium">{userProfile.experience} years</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rating</dt>
                  <dd className="mt-2 flex items-center text-base text-gray-900 font-bold">
                    <svg className="text-yellow-400 h-6 w-6 mr-1.5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {userProfile.rating} <span className="text-gray-400 font-normal ml-1">({userProfile.numReviews} reviews)</span>
                  </dd>
                </div>
                
                {userProfile.skills && userProfile.skills.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Core Skills</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-2">
                        {userProfile.skills.map((skill, index) => (
                          <li key={index} className="inline-flex items-center rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 shadow-sm transition-transform hover:-translate-y-0.5">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                
                {userProfile.resume && (
                  <div className="sm:col-span-2 pt-6 border-t border-gray-100">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Resume / CV</dt>
                    <dd className="mt-2">
                      <a 
                        href={`http://localhost:5000${userProfile.resume}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-primary-300 text-sm font-medium text-gray-700 transition-all group"
                      >
                        <svg className="h-5 w-5 text-primary-500 mr-2.5 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        View Attached Resume
                      </a>
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button onClick={() => navigate(-1)} className="btn-outline px-6 py-2">
          ← Back to previous page
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
