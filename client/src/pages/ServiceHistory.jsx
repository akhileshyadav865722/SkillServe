import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../api/axios';

function ServiceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view service history.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://localhost:5000/api/requests/me', config);
        
        const completedServices = response.data
          .filter(req => req.status === 'completed')
          .map(req => {
            const acceptedApplicant = req.applicants.find(app => app.status === 'accepted');
            return {
              requestContext: req,
              professional: acceptedApplicant ? acceptedApplicant.user : null
            };
          })
          .filter(item => item.professional); 

        setHistory(completedServices);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service history:', err);
        setError('Failed to load your service history.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10 relative overflow-x-hidden isolate font-sans">
      {/* Light Aurora Decor Background (Matched exactly to Home.jsx) */}
      <div className="fixed top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-indigo-200 to-blue-200 opacity-40 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200 to-teal-100 opacity-30 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-block py-1.5 px-6 rounded-full bg-blue-50/80 backdrop-blur-md text-blue-700 text-xs font-black tracking-widest uppercase mb-4 shadow-sm border border-blue-200/50">
            Timeline
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm mb-4 leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500">Service History</span>
          </h1>
          <p className="text-lg text-slate-600 font-bold max-w-xl mx-auto leading-relaxed drop-shadow-sm">
            A beautiful timeline of all your completed projects and the elite professionals who made them happen.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20 relative z-10">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-4 border-cyan-400 border-solid rounded-full animate-spin direction-reverse"></div>
              <div className="absolute inset-4 border-b-4 border-indigo-400 border-solid rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white/90 backdrop-blur-xl text-red-500 p-8 rounded-[24px] text-center font-bold border border-red-100 shadow-xl max-w-lg mx-auto relative z-10">
            <p className="text-5xl mb-4">😿</p>
            <p className="tracking-tight">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-12 sm:p-16 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 max-w-2xl mx-auto relative z-10 ring-1 ring-slate-900/5">
            <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100">
               <svg className="w-14 h-14 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Your history is a blank canvas!</h3>
            <p className="text-slate-500 font-bold text-lg mb-8 max-w-md mx-auto leading-relaxed">You haven't completed any services yet. When your projects are finished, the talented workers will show up here.</p>
            <Link to="/quick-hire" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-black rounded-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest border border-slate-700 text-sm">
              Hire Someone New
            </Link>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {history.map((item, index) => {
              const { requestContext, professional } = item;
              const dateFinished = new Date(requestContext.updatedAt || requestContext.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div 
                  key={requestContext._id} 
                  className="bg-white/80 backdrop-blur-xl rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(37,99,235,0.1)] transition-all duration-300 group relative flex flex-col sm:flex-row transform hover:-translate-y-1 ring-1 ring-slate-900/5"
                >
                  <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-blue-500 to-cyan-400 group-hover:w-2.5 transition-all duration-300 z-10"></div>

                  {/* Left Side: Professional Profile (COMPACTED) */}
                  <div className="px-6 py-6 sm:w-[240px] bg-slate-50/50 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 relative">

                    <div className="w-20 h-20 rounded-[1.2rem] overflow-hidden bg-white shadow-md shadow-blue-500/10 mb-4 relative group-hover:scale-105 transition-transform duration-300 rotate-[-2deg] group-hover:rotate-0 border-2 border-white ring-1 ring-slate-100">
                      {professional.profileImage ? (
                        <img src={`http://localhost:5000${professional.profileImage}`} alt={professional.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 border border-white text-blue-500 font-black text-3xl shadow-inner">
                          {professional.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-black text-slate-900 mb-1 text-center leading-tight tracking-tight">
                      {professional.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 bg-cyan-50 px-2 py-0.5 rounded-md text-cyan-700 font-bold text-xs mb-3 border border-cyan-100/50 shadow-sm">
                      <svg className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z"/></svg>
                      {professional.rating ? professional.rating.toFixed(1) : 'New'} 
                    </div>

                    <div className="mt-2 w-full">
                      <button 
                        onClick={() => navigate(`/user/${professional._id}`)}
                        className="w-full py-2 bg-white border border-slate-200 text-slate-600 font-black uppercase tracking-wider text-[10px] rounded-xl hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                      >
                        Profile
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Service Details (COMPACTED) */}
                  <div className="flex-1 px-6 py-6 flex flex-col relative bg-white/40">
                    <div className="absolute top-4 right-6 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 shadow-sm">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                       <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none mt-0.5">Completed</span>
                    </div>

                    <div className="mb-2 inline-flex items-center gap-1.5 text-slate-500 font-bold text-xs tracking-wide uppercase">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Finished <span className="text-slate-700">{dateFinished}</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pr-28 tracking-tight leading-tight line-clamp-1">
                      {requestContext.title}
                    </h4>
                    
                    <p className="text-slate-600 leading-relaxed text-sm font-bold mb-4 bg-slate-50/80 p-4 rounded-[16px] border border-slate-100 italic line-clamp-2">
                      “{requestContext.description}”
                    </p>

                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Final Budget</span>
                         <span className="text-2xl font-black text-slate-900 tracking-tight">₹{requestContext.budget.toLocaleString()}</span>
                      </div>
                      
                      <button 
                         onClick={() => navigate('/post-request')}
                         className="group flex-shrink-0 relative inline-flex items-center justify-center px-6 py-2.5 font-black text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-[0_6px_15px_rgba(37,99,235,0.2)] overflow-hidden text-xs hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)] border border-white/20 uppercase tracking-widest"
                      >
                         <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 bg-white transition-opacity"></span>
                         <span className="relative flex items-center gap-1.5">
                             Rehire
                             <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                         </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceHistory;
