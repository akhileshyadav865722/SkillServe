import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review state
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, review: '' });
  const [activeReviewRequest, setActiveReviewRequest] = useState(null);
  const [activeReviewProfessional, setActiveReviewProfessional] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === 'client') {
          const res = await axios.get('http://localhost:5000/api/requests/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyRequests(res.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
        fetchDashboardData();
    }
  }, [user, token]);

  const handleUpdateApplicant = async (requestId, userId, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/requests/${requestId}/applicants/${userId}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state with the returned updated request
      setMyRequests(myRequests.map(req => req._id === requestId ? res.data : req));
    } catch (error) {
      alert('Failed to update applicant status');
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/requests/${requestId}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMyRequests(myRequests.map(req => req._id === requestId ? res.data : req));
    } catch (error) {
      alert('Failed to update request status');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/requests/${activeReviewRequest}/reviews/${activeReviewProfessional}`,
        reviewFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted successfully!');
      setActiveReviewRequest(null);
      setActiveReviewProfessional(null);
      setReviewFormData({ rating: 5, review: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h2>
        <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <span className="text-sm text-gray-500 mr-2">Logged in as:</span>
            <span className="font-bold text-gray-900">{user.name}</span>
          </div>
          <span className="ml-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 capitalize shadow-sm">
            {user.role}
          </span>
        </div>
      </div>
      
      {user.role === 'client' ? (
        // CLIENT DASHBOARD
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-bold text-gray-900">My Posted Requests</h3>
            <Link to="/post-request" className="btn-primary flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post New Request
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 border-dashed">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No requests posted</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new service request.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {myRequests.map(req => (
                <div key={req._id} className="card group">
                  <div className="border-b border-gray-100 bg-gray-50/80 p-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors group-hover:bg-indigo-50/30">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{req.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 font-medium">Created on {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
                        req.status === 'open' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20' : 
                        req.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20' : 
                        'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20'
                      }`}>
                        {req.status}
                      </span>
                      
                      {req.status !== 'completed' && (
                        <select 
                          value={req.status} 
                          onChange={(e) => handleUpdateStatus(req._id, e.target.value)}
                          className="block w-full sm:w-auto rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Mark Completed</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h5 className="text-md font-semibold text-gray-900">Applicants</h5>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {req.applicants.length}
                      </span>
                    </div>
                    
                    {req.applicants.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No applications yet.</p>
                    ) : (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {req.applicants.map(app => (
                          <div key={app._id} className={`rounded-lg border p-4 ${
                            app.status === 'accepted' ? 'bg-green-50/50 border-green-100' : 
                            app.status === 'rejected' ? 'bg-red-50/50 border-red-100' : 
                            'bg-white border-gray-200 shadow-sm'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <Link to={`/user/${app.user._id}`} className="text-gray-900 font-bold hover:text-primary-600 hover:underline transition-colors block truncate pr-2">
                                {app.user.name}
                              </Link>
                              <span className="inline-flex items-center text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md shrink-0">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {app.user.rating}/5
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-1">{app.user.experience} yrs exp • {app.user.email}</p>
                            
                            <div className="mt-4 flex flex-col gap-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Status:</span>
                                <span className={`font-semibold ${
                                  app.status === 'pending' ? 'text-yellow-600' : 
                                  app.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                                } capitalize`}>
                                  {app.status}
                                </span>
                              </div>
                              
                              {app.status === 'pending' && req.status !== 'completed' && (
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <button 
                                    onClick={() => handleUpdateApplicant(req._id, app.user._id, 'accepted')}
                                    className="rounded bg-green-50 text-green-700 px-2 py-1.5 text-xs font-semibold hover:bg-green-100 transition-colors border border-green-200"
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateApplicant(req._id, app.user._id, 'rejected')}
                                    className="rounded bg-red-50 text-red-700 px-2 py-1.5 text-xs font-semibold hover:bg-red-100 transition-colors border border-red-200"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              
                              {app.status === 'accepted' && req.status === 'completed' && (
                                <button 
                                  onClick={() => {
                                    setActiveReviewRequest(req._id);
                                    setActiveReviewProfessional(app.user._id);
                                  }}
                                  className="w-full rounded bg-primary-50 text-primary-700 px-3 py-2 text-sm font-semibold hover:bg-primary-100 transition-colors mt-1 border border-primary-200"
                                >
                                  Leave a Review
                                </button>
                              )}
                            </div>
                            
                            {activeReviewRequest === req._id && activeReviewProfessional === app.user._id && (
                              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                                <h6 className="font-semibold text-gray-900 mb-3 text-sm">Review {app.user.name}</h6>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                                    <select 
                                      value={reviewFormData.rating}
                                      onChange={(e) => setReviewFormData({...reviewFormData, rating: e.target.value})}
                                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                                      required
                                    >
                                      <option value="5">5 - Excellent</option>
                                      <option value="4">4 - Very Good</option>
                                      <option value="3">3 - Average</option>
                                      <option value="2">2 - Poor</option>
                                      <option value="1">1 - Terrible</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Feedback</label>
                                    <textarea 
                                      placeholder="Share your experience..."
                                      value={reviewFormData.review}
                                      onChange={(e) => setReviewFormData({...reviewFormData, review: e.target.value})}
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                                      rows={2}
                                      required
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button type="submit" className="flex-1 rounded bg-green-600 text-white px-2 py-1.5 text-xs font-semibold hover:bg-green-700">Submit</button>
                                    <button type="button" onClick={() => setActiveReviewRequest(null)} className="flex-1 rounded bg-gray-200 text-gray-800 px-2 py-1.5 text-xs font-semibold hover:bg-gray-300">Cancel</button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // PROFESSIONAL DASHBOARD
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Work Opportunities</h3>
            <p className="text-gray-600 mb-6">Browse our marketplace to find jobs that match your skills.</p>
            <Link to="/requests" className="btn-primary inline-flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              Browse Available Requests
            </Link>
          </div>
          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-12 text-center">
            <p className="text-gray-500 italic">Your application history tracking will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
