import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">

      {/* 1. Header Banner */}
      <div className="relative glass p-6 sm:p-10 rounded-[32px] mb-10 overflow-hidden border border-white/60 shadow-sm transition-all hover:shadow-md">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 relative z-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] drop-shadow-sm">{user?.name?.split(' ')[0]}</span>!
            </h2>
            <p className="text-gray-600 font-medium text-lg">Manage your {user?.role === 'client' ? 'posted requests and talent' : 'opportunities and profile'}.</p>
          </div>

          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <div className="h-10 w-10 border-2 border-white rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 leading-none">{user?.name}</span>
                <span className="inline-flex items-center rounded-md bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-black uppercase text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-primary)]/20 shadow-sm">
                  {user?.role}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium block truncate max-w-[150px] mt-1">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'client' ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 ml-2">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">My Posted Requests</h3>
            </div>
            <Link to="/post-request" className="btn-primary flex items-center gap-2 rounded-xl py-2.5 px-5 shadow-md hover:shadow-lg shadow-[var(--color-primary)]/20 hover:-translate-y-0.5 transition-all text-sm font-extrabold uppercase tracking-wide">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post New Request
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-20 glass rounded-[32px] shadow-sm border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">No requests posted yet</h3>
              <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto font-medium">Get your project started by creating a new service request and reaching out to professionals.</p>
              <Link to="/post-request" className="mt-6 inline-block btn-primary px-6 py-3 font-bold rounded-xl shadow-md">
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {myRequests.map(req => (
                <div key={req._id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 relative group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${req.status === 'open' ? 'bg-emerald-400' : req.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>

                  <div className="border-b border-gray-100 bg-gray-50/50 p-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-8">
                    <div>
                      <Link to={`/requests/${req._id}`} className="text-xl font-bold text-gray-900 hover:text-[var(--color-primary)] transition-colors mb-1 inline-block">
                        {req.title}
                      </Link>
                      <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 opacity-80">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Posted on {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto p-1 bg-white rounded-xl shadow-sm border border-gray-100">
                      <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${req.status === 'open' ? 'bg-emerald-50 text-emerald-700' :
                          req.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${req.status === 'open' ? 'bg-emerald-500' : req.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                        {req.status.replace('-', ' ')}
                      </span>

                      {req.status !== 'completed' && (
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateStatus(req._id, e.target.value)}
                          className="block w-full sm:w-[130px] rounded-lg border-0 py-1.5 pl-3 pr-8 text-gray-700 bg-gray-50 hover:bg-gray-100 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white sm:text-xs font-extrabold cursor-pointer transition-colors shadow-sm outline-none"
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
                      <h5 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Applicants
                      </h5>
                      <span className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)]/10 px-2.5 py-1 text-sm font-black text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-primary)]/20 shadow-sm">
                        {req.applicants.length} Total
                      </span>
                    </div>

                    {req.applicants.length === 0 ? (
                      <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 border-dashed">
                        <p className="text-sm text-gray-500 font-bold">No applications have been submitted yet. Check back soon!</p>
                      </div>
                    ) : (
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {req.applicants.map(app => (
                          <div key={app.user._id} className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md relative overflow-hidden ${app.status === 'accepted' ? 'bg-emerald-50/40 border-emerald-200' :
                              app.status === 'rejected' ? 'bg-red-50/40 border-red-100' :
                                'bg-white border-gray-200 shadow-sm hover:border-[var(--color-primary)]/40'
                            }`}>

                            <div className="flex justify-between items-start mb-3">
                              <Link to={`/user/${app.user._id}`} className="flex items-center gap-3 shrink-0 max-w-[70%] group/link cursor-pointer">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300 shadow-sm group-hover/link:border-[var(--color-primary)] transition-colors">
                                  {app.user.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                  <h4 className="text-gray-900 font-bold group-hover/link:text-[var(--color-primary)] transition-colors truncate">{app.user.name}</h4>
                                  <p className="text-xs text-gray-500 font-medium truncate">{app.user.email}</p>
                                </div>
                              </Link>

                              <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-lg shrink-0 shadow-sm">
                                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {app.user.rating}/5
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm inline-block">
                              <span className="font-extrabold text-gray-900">{app.user.experience}</span> <span className="font-medium">yrs experience</span>
                            </p>

                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                              <div className="flex justify-between items-center text-sm bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100/50 shadow-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Status</span>
                                <span className={`font-black text-xs uppercase tracking-wider ${app.status === 'pending' ? 'text-amber-600' :
                                    app.status === 'accepted' ? 'text-emerald-600' : 'text-red-500'
                                  }`}>
                                  {app.status}
                                </span>
                              </div>

                              {app.status === 'pending' && req.status !== 'completed' && (
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <button
                                    onClick={() => handleUpdateApplicant(req._id, app.user._id, 'accepted')}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2.5 text-xs font-extrabold uppercase hover:bg-emerald-500 hover:text-white transition-all border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-500"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateApplicant(req._id, app.user._id, 'rejected')}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 text-red-700 px-3 py-2.5 text-xs font-extrabold uppercase hover:bg-red-500 hover:text-white transition-all border border-red-200 shadow-sm focus:ring-2 focus:ring-red-500"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
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
                                  className="w-full rounded-xl bg-[var(--color-primary)] text-white px-4 py-2.5 text-sm font-bold hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all shadow-md flex items-center justify-center gap-2 mt-1 hover:-translate-y-0.5"
                                >
                                  Submit a Review
                                </button>
                              )}
                            </div>

                            {activeReviewRequest === req._id && activeReviewProfessional === app.user._id && (
                              <div className="mt-4 p-5 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-xl relative z-20">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
                                <h6 className="font-extrabold text-gray-900 mb-3 text-sm pt-1">
                                  Review {app.user.name.split(' ')[0]}
                                </h6>
                                <form onSubmit={handleSubmitReview} className="space-y-4 relative z-10">
                                  <div>
                                    <label className="block text-[10px] font-black text-gray-500 mb-1.5 uppercase tracking-wider">Rating</label>
                                    <select
                                      value={reviewFormData.rating}
                                      onChange={(e) => setReviewFormData({ ...reviewFormData, rating: e.target.value })}
                                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-8 text-gray-700 font-bold focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent sm:text-xs shadow-sm bg-white"
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
                                    <label className="block text-[10px] font-black text-gray-500 mb-1.5 uppercase tracking-wider">Feedback</label>
                                    <textarea
                                      placeholder="Share your experience working with them..."
                                      value={reviewFormData.review}
                                      onChange={(e) => setReviewFormData({ ...reviewFormData, review: e.target.value })}
                                      className="block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent sm:text-sm shadow-sm bg-white resize-none font-medium"
                                      rows={3}
                                      required
                                    />
                                  </div>
                                  <div className="flex gap-2 pt-1">
                                    <button type="submit" className="flex-1 rounded-xl bg-[var(--color-primary)] text-white px-3 py-2.5 text-xs uppercase tracking-wide font-extrabold hover:bg-[var(--color-secondary)] shadow-md transition-colors border border-transparent">Submit</button>
                                    <button type="button" onClick={() => setActiveReviewRequest(null)} className="rounded-xl bg-white text-gray-700 px-4 py-2.5 text-xs uppercase tracking-wide font-extrabold hover:bg-gray-100 shadow-sm border border-gray-200 transition-colors">Cancel</button>
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
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--color-primary)] via-[#A894FF] to-[#D5C2FF] p-10 sm:p-16 text-center shadow-2xl mb-8 group border border-white/20">
            {/* Dynamic Glass Background Elements */}
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/20 blur-3xl group-hover:bg-white/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-accent)]/20 blur-3xl group-hover:bg-[var(--color-accent)]/30 transition-colors duration-700"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold tracking-wider border border-white/30 backdrop-blur-md mb-8 uppercase shadow-sm">
                <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" /></svg>
                Hot Opportunities Available
              </span>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md leading-[1.15]">
                Ready to land your next big project?
              </h3>
              <p className="text-lg sm:text-xl text-white/90 mb-10 font-bold leading-relaxed max-w-2xl px-4">
                Clients are actively seeking professionals with your expertise. Browse the verified requests market and send your application today.
              </p>

              <Link to="/requests" className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white text-[var(--color-primary)] hover:text-[#7A5AF8] text-lg lg:text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group/btn border-2 border-transparent">
                Browse Available Requests
                <svg className="w-6 h-6 transform group-hover/btn:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 hidden sm:grid">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner border border-blue-100">🚀</div>
              <div>
                <p className="text-xs text-gray-500 font-black uppercase tracking-wider mb-1">Growth</p>
                <p className="text-base font-black text-gray-900 leading-tight">Level up your rank</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-2xl shadow-inner border border-amber-100">⭐</div>
              <div>
                <p className="text-xs text-gray-500 font-black uppercase tracking-wider mb-1">Reputation</p>
                <p className="text-base font-black text-gray-900 leading-tight">Gather 5-star reviews</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-100"></div>
              <div>
                <p className="text-xs text-gray-500 font-black uppercase tracking-wider mb-1">Earnings</p>
                <p className="text-base font-black text-gray-900 leading-tight">Set your own rates</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
