import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests');
        setRequests(res.data);
      } catch (error) {
        console.error('Error fetching requests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApply = async (requestId) => {
    try {
      await api.post(`/requests/${requestId}/apply`, {}, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      alert('Successfully applied to request!');
      
      setRequests(requests.map(req => {
        if (req._id === requestId) {
          return { ...req, applicants: [...req.applicants, { user: user._id, status: 'pending' }] };
        }
        return req;
      }));
    } catch (error) {
       alert(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh] bg-slate-50 relative isolate">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400 opacity-20 blur-[40px] rounded-full animate-pulse"></div>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-cyan-400 border-solid rounded-full animate-spin direction-reverse"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24 relative overflow-x-hidden isolate">
      
      {/* 
        Subtle Background Orbs for the overall page 
      */}
      <div className="fixed top-0 right-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-0 left-[-10%] w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-20">
        
        {/* TOP HERO BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 rounded-[32px] p-8 sm:p-12 mb-12 shadow-[0_15px_40px_rgba(37,99,235,0.2)] border border-blue-400/30 isolate">
          
          {/* Internal Banner Glass Patterns */}
          <div className="absolute top-[-50%] left-[-10%] w-[300px] h-[300px] bg-white/20 blur-[40px] rounded-full z-[-1]"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-cyan-300/30 blur-[50px] rounded-full z-[-1]"></div>
          
          <svg className="absolute inset-0 w-full h-full opacity-10 mix-blend-overlay z-[-1]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/30 backdrop-blur-md mb-4 shadow-sm">
                Service Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
                Browse Active <span className="text-cyan-200">Requests</span>
              </h1>
              <p className="text-blue-50 font-bold max-w-xl text-sm sm:text-base leading-relaxed drop-shadow-sm">
                Discover clients looking for your specific skill set. Apply to gigs, negotiate budgets, and grow your professional portfolio instantly.
              </p>
            </div>
            
            <div className="hidden md:flex flex-col gap-3 shrink-0 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                 </div>
                 <div>
                   <p className="text-white font-black text-lg leading-none">{requests.length}</p>
                   <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Live Requests</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* CUTE MARGIN DIVIDER WITH HIGH CONTRAST */}
        <div className="flex items-center justify-center -mt-6 mb-12 relative z-30 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-full px-8 py-3 flex items-center gap-4 shadow-[0_8px_20px_rgba(37,99,235,0.15)] border-2 border-blue-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0ms' }}></span>
            <span className="text-xs font-black uppercase tracking-widest text-blue-800 drop-shadow-sm">Explore Services Feed</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ animationDelay: '150ms' }}></span>
          </div>
        </div>

        {/* MAIN CARDS LIST - Stacked Rectangles, Tinted Color */}
        {requests.length === 0 ? (
          <div className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100/50 p-16 text-center max-w-2xl mx-auto ring-1 ring-blue-900/5">
            <div className="mx-auto h-20 w-20 bg-blue-100/50 border border-blue-200 rounded-full flex items-center justify-center shadow-inner mb-6">
              <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No active requests</h3>
            <p className="text-blue-800 font-bold text-sm">The market is quiet right now. Check back soon for new opportunities.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {requests.map(req => (
              <div 
                key={req._id} 
                className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-2xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] border-2 border-white hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col md:flex-row group relative ring-1 ring-blue-900/5"
              >
                
                {/* Left Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Left Side: Content & Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col gap-4 pl-8">
                  
                  <div className="flex items-center gap-3 mb-1">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-200 shadow-sm">
                      {req.category}
                    </span>
                    <span className="text-[11px] text-blue-700 font-black uppercase tracking-widest flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors tracking-tight pr-4">
                    {req.title}
                  </h3>
                  
                  {req.description && (
                     <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border-l-4 border-blue-400 shadow-sm max-w-3xl">
                       <p className="text-slate-800 font-bold text-sm leading-relaxed line-clamp-2">
                         {req.description}
                       </p>
                     </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {req.location}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                      <svg className="h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {new Date(req.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {req.requiredSkills && req.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-4 border-t-2 border-blue-200/50">
                      {req.requiredSkills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center rounded-lg bg-white border border-blue-200 px-3 py-1.5 text-[10px] font-black text-blue-800 uppercase tracking-widest shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Budget & Actions */}
                <div className="p-6 sm:p-8 bg-white/40 md:w-64 border-t md:border-t-0 md:border-l-2 border-blue-200/50 flex flex-col justify-center items-center md:items-end text-center md:text-right shrink-0">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Fixed Budget</span>
                  <div className="text-3xl font-black text-slate-900 tracking-tight mb-6">
                    ₹{req.budget.toLocaleString()}
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full">
                    {user?.role === 'professional' && (
                      <button 
                        onClick={() => handleApply(req._id)}
                        className="w-full flex items-center justify-center py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all shadow-md group/btn border border-white/20"
                      >
                        Apply Now
                      </button>
                    )}
                    <Link 
                      to={`/requests/${req._id}`} 
                      className="w-full flex items-center justify-center py-3.5 bg-white border-2 border-blue-100 text-blue-800 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestsList;
