import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/notificationSlice';

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Review state
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, review: '' });
  const [activeReviewRequest, setActiveReviewRequest] = useState(null);
  const [activeReviewProfessional, setActiveReviewProfessional] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === 'client') {
          const res = await api.get('/requests/me', {
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
      const res = await api.put(`/requests/${requestId}/applicants/${userId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyRequests(myRequests.map(req => req._id === requestId ? res.data : req));
      
      if (status === 'accepted') {
        dispatch(addNotification({
          title: 'Application Accepted!',
          message: `Congratulations! A client has accepted an application for a request.`,
          type: 'success',
          icon: 'check-circle'
        }));
      }
    } catch (error) {
      alert('Failed to update applicant status');
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const res = await api.put(`/requests/${requestId}/status`,
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
      await api.post(
        `/requests/${activeReviewRequest}/reviews/${activeReviewProfessional}`,
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
      <div className="absolute inset-0 border-t-4 border-blue-500 border-solid rounded-full animate-spin h-12 w-12 m-auto"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className={`relative min-h-screen font-sans overflow-hidden animate-fade-in pb-32 ${
      user?.role === 'client' ? 'bg-[#f4f7fa]' : 'bg-[#fafbfe]'
    }`}>
      
      {/* --- DYNAMIC BACKGROUNDS --- */}
      {user?.role === 'client' ? (
        <div className="absolute inset-0 pointer-events-none z-0">
           {/* Client Background: Solid Architectural Grid Pattern */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.07)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
           <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-blue-400/10 blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-cyan-300/10 blur-[120px]" style={{ animation: 'pulse 6s ease-in-out infinite' }}></div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
           {/* Professional Background: Blue Shades Orbs */}
           <div className="absolute top-[-30%] right-[-20%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-blue-500/15 blur-[150px] mix-blend-multiply animate-[spin_12s_linear_infinite]"></div>
           <div className="absolute bottom-[-30%] left-[-20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-cyan-400/15 blur-[130px] mix-blend-multiply animate-[spin_18s_linear_infinite_reverse]"></div>
           <div className="absolute top-[20%] left-[40%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-sky-300/20 blur-[140px] mix-blend-multiply animate-pulse"></div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* 1. Header Banner */}
        <div className={`relative backdrop-blur-xl p-6 sm:p-10 rounded-[32px] mb-10 overflow-hidden shadow-lg transition-all border border-white
          ${user?.role === 'client' 
            ? 'bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-900/5 hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)]' 
            : 'bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-blue-500/10 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] text-slate-900'}`}>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 opacity-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none animate-pulse"></div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 relative z-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-slate-900">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm">{user?.name?.split(' ')[0]}</span>!
              </h2>
              <p className="font-bold text-lg drop-shadow-sm text-slate-600">
                {user?.role === 'client' ? 'Manage your posted requests and talent.' : 'Dive into your creative workspace.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl shadow-sm border transition-shadow ring-1 bg-white/90 backdrop-blur-md border-slate-100 hover:shadow-md ring-slate-900/5">
              <div className="h-12 w-12 border-[3px] border-white rounded-[16px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-inner">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold leading-none text-slate-900">{user?.name}</span>
                  <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border shadow-sm bg-blue-50 text-blue-600 border-blue-100">
                    {user?.role}
                  </span>
                </div>
                <span className="text-xs font-bold block truncate max-w-[150px] mt-1 text-slate-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

      {user?.role === 'client' ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-xl p-5 rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
            <div className="flex items-center gap-3 ml-2">
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">My Posted Requests</h3>
            </div>
            <Link to="/post-request" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_6px_15px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 transition-all duration-300 py-3 px-6 text-sm font-black uppercase tracking-widest border border-white/20 w-full sm:w-auto justify-center group/btn">
              <svg className="h-5 w-5 transform group-hover/btn:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post New Request
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-[32px] shadow-sm border-[3px] border-dashed border-slate-200 hover:border-blue-200 transition-colors">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-blue-400 mb-6 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No requests posted yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-bold mb-8">Get your project started by creating a new service request and reaching out to professionals.</p>
              <Link to="/post-request" className="inline-block bg-slate-900 text-white px-8 py-4 font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all">
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {myRequests.map(req => (
                <div key={req._id} className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(37,99,235,0.1)] transition-all duration-300 relative group ring-1 ring-slate-900/5">
                  <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors ${req.status === 'open' ? 'bg-emerald-400' : req.status === 'in-progress' ? 'bg-yellow-400' : 'bg-slate-300'}`}></div>

                  <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-8">
                    <div>
                      <Link to={`/requests/${req._id}`} className="text-xl font-black text-slate-900 hover:text-blue-600 transition-colors mb-1 inline-block tracking-tight leading-tight">
                        {req.title}
                      </Link>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Posted on {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
                      <span className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${req.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          req.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${req.status === 'open' ? 'bg-emerald-500 animate-pulse' : req.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        {req.status.replace('-', ' ')}
                      </span>

                      {req.status !== 'completed' && (
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateStatus(req._id, e.target.value)}
                          className="block w-full sm:w-[130px] rounded-[8px] border-0 py-1.5 pl-3 pr-8 text-slate-700 bg-slate-50 hover:bg-slate-100 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white sm:text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors shadow-sm outline-none"
                        >
                          <option value="open">Set: Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Complete</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:px-8 pl-8">
                    <div className="flex items-center justify-between mb-5">
                      <h5 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Applicants
                      </h5>
                      <span className="inline-flex items-center justify-center rounded-lg bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-600 border border-blue-100 shadow-sm">
                        {req.applicants.length} Total
                      </span>
                    </div>

                    {req.applicants.length === 0 ? (
                      <div className="bg-slate-50 rounded-[20px] p-8 text-center border-2 border-slate-200 border-dashed">
                        <p className="text-sm text-slate-500 font-bold">No applications have been submitted yet. Check back soon!</p>
                      </div>
                    ) : (
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {req.applicants.map(app => (
                          <div key={app.user._id} className={`rounded-[20px] border p-5 transition-all duration-300 hover:shadow-xl relative overflow-hidden ${app.status === 'accepted' ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300' :
                              app.status === 'rejected' ? 'bg-red-50/40 border-red-100 hover:border-red-200' :
                                'bg-white border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-blue-200/60'
                            }`}>

                            <div className="flex justify-between items-start mb-4">
                              <Link to={`/user/${app.user._id}`} className="flex items-center gap-3 shrink-0 max-w-[70%] group/link cursor-pointer">
                                <div className="h-12 w-12 shrink-0 rounded-[12px] bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-blue-600 font-black text-xl border border-white shadow-sm ring-1 ring-slate-100 group-hover/link:border-blue-200 transition-colors">
                                  {app.user.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                  <h4 className="text-slate-900 font-black tracking-tight group-hover/link:text-blue-600 transition-colors truncate">{app.user.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate hidden sm:block">{app.user.email}</p>
                                </div>
                              </Link>

                              <span className="inline-flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-md shrink-0 shadow-sm">
                                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {app.user.rating}/5
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mb-5 bg-slate-50 p-2.5 rounded-[12px] border border-slate-100 shadow-inner flex items-center gap-1.5">
                              <span className="font-black text-slate-900 text-sm bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">{app.user.experience}</span> 
                              <span className="font-bold uppercase tracking-wide text-[10px]">yrs exp.</span>
                            </p>

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                              <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Status</span>
                                <span className={`font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md ${app.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                  {app.status}
                                </span>
                              </div>

                              {app.status === 'pending' && req.status !== 'completed' && (
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <button
                                    onClick={() => handleUpdateApplicant(req._id, app.user._id, 'accepted')}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateApplicant(req._id, app.user._id, 'rejected')}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 text-red-700 px-3 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
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
                                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3 text-xs uppercase tracking-widest font-black hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all shadow-md flex items-center justify-center gap-2 mt-1 border border-white/20 hover:-translate-y-0.5"
                                >
                                  Submit a Review
                                </button>
                              )}
                            </div>

                            {activeReviewRequest === req._id && activeReviewProfessional === app.user._id && (
                                <div className="mt-4 p-5 bg-white/95 backdrop-blur-xl rounded-[20px] border border-slate-200 shadow-2xl relative z-20 ring-1 ring-slate-900/5">
                                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-[20px]"></div>
                                  <h6 className="font-black text-slate-900 mb-4 text-xs uppercase tracking-wider pt-2 flex items-center gap-2">
                                    Review {app.user.name.split(' ')[0]}
                                  </h6>
                                  <form onSubmit={handleSubmitReview} className="space-y-4 relative z-10">
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Rating</label>
                                      <select
                                        value={reviewFormData.rating}
                                        onChange={(e) => setReviewFormData({ ...reviewFormData, rating: e.target.value })}
                                        className="block w-full rounded-xl border border-slate-200 py-3 pl-4 pr-8 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-xs shadow-inner bg-slate-50 outline-none"
                                        required
                                      >
                                        <option value="5">⭐⭐⭐⭐⭐ 5</option>
                                        <option value="4">⭐⭐⭐⭐ 4</option>
                                        <option value="3">⭐⭐⭐ 3</option>
                                        <option value="2">⭐⭐ 2</option>
                                        <option value="1">⭐ 1</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Feedback</label>
                                      <textarea
                                        placeholder="Share your experience working with them..."
                                        value={reviewFormData.review}
                                        onChange={(e) => setReviewFormData({ ...reviewFormData, review: e.target.value })}
                                        className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm shadow-inner bg-slate-50 resize-none font-medium leading-relaxed outline-none"
                                        rows={3}
                                        required
                                      />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <button type="submit" className="flex-1 rounded-xl bg-slate-900 text-white px-3 py-3 text-[10px] uppercase tracking-widest font-black hover:bg-slate-800 shadow-lg hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5">Submit</button>
                                      <button type="button" onClick={() => setActiveReviewRequest(null)} className="rounded-xl bg-white text-slate-600 px-4 py-3 text-[10px] uppercase tracking-widest font-black hover:bg-slate-50 shadow-sm border border-slate-200 hover:border-slate-300 transition-all">Cancel</button>
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
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[40px] bg-blue-600 p-10 sm:p-20 text-center shadow-[0_25px_50px_rgba(37,99,235,0.25)] mb-8 group border-[4px] border-white ring-1 ring-slate-900/5 hover:-translate-y-1 transition-transform duration-500">
            {/* Blue Solid Pattern Backside */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:40px_40px]"></div>
            
            {/* Soft inner glow */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-300/30 blur-[80px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-400/30 blur-[80px] mix-blend-screen pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-black tracking-widest border border-white/40 backdrop-blur-md mb-8 uppercase shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-pulse shadow-[0_0_10px_rgba(253,224,71,0.5)]"></span>
                Hot Opportunities Available
              </span>
              <h3 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-[1.1]">
                Launch into your <span className="text-cyan-100">next big project.</span>
              </h3>
              <p className="text-lg sm:text-2xl text-blue-100 mb-12 font-bold leading-relaxed max-w-2xl px-4 drop-shadow-sm">
                Clients are actively seeking professionals with your expertise. Browse the verified requests market and secure your contract today.
              </p>

              <Link to="/requests" className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 sm:py-6 bg-white text-blue-700 text-sm sm:text-base font-black uppercase tracking-widest rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 group/btn border border-blue-50">
                Browse Global Terminal
                <svg className="w-6 h-6 transform group-hover/btn:translate-x-2 transition-transform text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 hidden sm:grid">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 hover:border-blue-100 transition-all ring-1 ring-slate-900/5 group">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-blue-500 flex items-center justify-center font-black text-3xl shadow-inner border border-white group-hover:scale-110 transition-transform">🚀</div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Growth</p>
                <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">Level up your rank</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 hover:border-blue-100 transition-all ring-1 ring-slate-900/5 group">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-cyan-500 flex items-center justify-center font-black text-3xl shadow-inner border border-white group-hover:scale-110 transition-transform">⭐</div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Reputation</p>
                <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">Gather 5-star reviews</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 hover:border-blue-100 transition-all ring-1 ring-slate-900/5 group">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 text-emerald-500 flex items-center justify-center font-black text-3xl shadow-inner border border-white group-hover:scale-110 transition-transform">💎</div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Earnings</p>
                <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">Set your own rates</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
