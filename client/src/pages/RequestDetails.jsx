import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

function RequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/requests/${id}`);
        setRequest(res.data);
      } catch (error) {
        console.error('Error fetching request', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this awesome request?')) {
      try {
        await api.delete(`/requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/requests');
      } catch (error) {
        alert('Failed to delete request');
      }
    }
  };

  const handleApply = async () => {
    try {
      await api.post(`/requests/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${user.token || localStorage.getItem('token')}` }
      });
      alert('Successfully applied to request!');
      
      setRequest({
        ...request,
        applicants: [...request.applicants, { user: user._id, status: 'pending' }]
      });
    } catch (error) {
       alert(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-t-4 border-indigo-200 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-purple-200 border-solid rounded-full animate-spin direction-reverse"></div>
      </div>
    </div>
  );
  
  if (!request) return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="text-center p-12 bg-white/80 backdrop-blur-lg border border-red-50 shadow-xl rounded-[32px] max-w-lg w-full">
        <div className="w-24 h-24 bg-red-50 text-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Request Not Found!</h3>
        <p className="text-gray-500 font-medium mb-8">The beautiful service request you are looking for has vanished or does not exist.</p>
        <button onClick={() => navigate('/requests')} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-sm">Back to Requests</button>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const hasApplied = user?.role === 'professional' && request.applicants.some(app => app.user?._id === user._id || app.user === user._id);

  return (
    <div className="bg-gray-50 min-h-screen py-12 relative overflow-hidden isolate font-sans pb-24">
      {/* Premium Animated Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/50 to-purple-200/50 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow mix-blend-multiply"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/50 to-rose-200/50 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow mix-blend-multiply delay-1000"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate('/requests')} className="group mb-8 inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-x-1">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Service Listings
        </button>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white/80 overflow-hidden relative">
          
          {/* Header Banner */}
          <div className="h-40 sm:h-56 bg-gradient-to-r from-slate-700 to-slate-800 relative flex items-end p-8 sm:p-12 overflow-hidden border-b border-gray-100">
             {/* Decorative patterns */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-60 -mr-20 -mt-20"></div>

             <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-sm border ${request.status === 'open' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' : 'bg-white/10 text-white border-white/20'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${request.status === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></span>
                    {request.status}
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm leading-tight">
                    {request.title}
                  </h1>
                </div>
                
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 text-center shrink-0 shadow-sm">
                  <div className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Total Budget</div>
                  <div className="text-3xl font-black text-white drop-shadow-sm">₹{request.budget?.toLocaleString()}</div>
                </div>
             </div>
          </div>

          <div className="p-8 sm:p-12">
            
            {/* Description Area */}
            <div className="mb-12">
              <h3 className="text-xl font-black text-gray-700 mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7"/></svg>
                Project Description
              </h3>
              <div className="bg-white/60 border border-gray-100 rounded-2xl p-6 sm:p-8">
                 <p className="text-gray-600 leading-loose text-lg font-medium whitespace-pre-wrap">
                   {request.description}
                 </p>
              </div>
            </div>

            {/* Two Column Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 mb-12">
              
              {/* Job Details Cards */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Job Specifications</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Category</p>
                      <p className="font-bold text-gray-800 truncate">{request.category}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-400 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Location</p>
                      <p className="font-bold text-gray-700 break-words whitespace-normal">{request.location}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-2xl p-5 flex items-start gap-4 sm:col-span-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Deadline Date</p>
                      <p className="font-bold text-gray-800 truncate">{new Date(request.deadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Info Card */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Posted By Client</h3>
                <Link to={`/user/${request.createdBy?._id}`} className="block group">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 flex items-center gap-6 shadow-sm group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-all duration-300">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-400 font-black text-3xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-500">
                        {request.createdBy?.name?.charAt(0) || 'C'}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-50">
                        <div className="w-6 h-6 rounded-full bg-blue-400 text-white flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-800 group-hover:text-indigo-500 transition-colors mb-1">{request.createdBy?.name}</h4>
                      <p className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 inline-block">
                        Posted on {new Date(request.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

            </div>

            {/* Required Skills Section */}
            {request.requiredSkills && request.requiredSkills.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {request.requiredSkills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 border border-indigo-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md hover:border-indigo-300 cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-sm font-bold text-gray-400">
                {request.applicants?.length || 0} applied so far
              </span>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {user?._id === request.createdBy?._id && (
                  <button onClick={handleDelete} className="px-6 py-3.5 rounded-2xl font-bold bg-white text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all focus:outline-none focus:ring-4 focus:ring-red-100 w-full sm:w-auto">
                    Delete Request
                  </button>
                )}
                
                {user?.role === 'professional' && (
                  <button 
                    onClick={handleApply}
                    disabled={request.status !== 'open' || hasApplied}
                    className={`group relative inline-flex items-center justify-center px-10 py-3.5 font-black transition-all duration-300 rounded-2xl w-full sm:w-auto overflow-hidden ${
                      request.status !== 'open' || hasApplied
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100'
                        : 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-1 shadow-md hover:shadow-lg focus:ring-4 focus:ring-slate-200'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       {hasApplied ? (
                         <>
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                           Already Applied
                         </>
                       ) : request.status !== 'open' ? (
                         'Job Unavailable'
                       ) : (
                         <>
                           Submit Proposal
                           <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                         </>
                       )}
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;
