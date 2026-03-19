import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../api/axios'; // Adjust if needed to import api instance directly

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
        
        // Filter out only completed requests where an applicant was accepted
        const completedServices = response.data
          .filter(req => req.status === 'completed')
          .map(req => {
            const acceptedApplicant = req.applicants.find(app => app.status === 'accepted');
            return {
              requestContext: req,
              professional: acceptedApplicant ? acceptedApplicant.user : null
            };
          })
          .filter(item => item.professional); // Ensure there is a professional associated

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
    <div className="bg-[#FAFAFA] min-h-screen py-10 relative overflow-hidden isolate font-sans">
      {/* Cute & Realistic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/60 to-teal-100/60 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/60 to-blue-100/60 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow mix-blend-multiply"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <span className="absolute -top-6 -right-8 text-4xl animate-bounce">✨</span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-800 tracking-tight drop-shadow-sm mb-4 relative z-10">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Service History</span>
            </h1>
          </div>
          <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
            A beautiful timeline of all your completed projects and the amazing professionals who made them happen.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-t-4 border-emerald-400 border-solid rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-4 border-teal-300 border-solid rounded-full animate-spin direction-reverse"></div>
              <div className="absolute inset-4 border-b-4 border-cyan-200 border-solid rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-8 rounded-[32px] text-center font-bold border border-red-100 shadow-sm max-w-lg mx-auto">
            <p className="text-6xl mb-4">😿</p>
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <span className="text-6xl drop-shadow-sm">🌱</span>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-3">Your history is a blank canvas!</h3>
            <p className="text-gray-500 font-medium text-lg mb-8">You haven't completed any services yet. When your projects are finished, the talented workers will show up here.</p>
            <Link to="/quick-hire" className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-900/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300">
              Hire Someone New
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {history.map((item, index) => {
              const { requestContext, professional } = item;
              const dateFinished = new Date(requestContext.updatedAt || requestContext.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div 
                  key={requestContext._id} 
                  className="bg-white/90 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.05)] border border-white hover:border-emerald-100 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 group relative flex flex-col sm:flex-row"
                >
                  <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-emerald-400 to-teal-400"></div>

                  {/* Left Side: Professional Profile (Realistic & Cute) */}
                  <div className="p-8 sm:w-[340px] bg-gradient-to-br from-emerald-50/50 to-transparent flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 relative">
                    {/* Floating decoration */}
                    <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-emerald-300 animate-pulse"></div>
                    <div className="absolute bottom-10 right-8 w-2 h-2 rounded-full bg-teal-300 animate-ping"></div>

                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-emerald-200/40 mb-5 relative group-hover:scale-105 transition-transform duration-500 rotate-[-2deg] group-hover:rotate-0 border-4 border-white">
                      {professional.profileImage ? (
                        <img src={`http://localhost:5000${professional.profileImage}`} alt={professional.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 font-black text-5xl">
                          {professional.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-800 mb-1 text-center leading-tight">
                      {professional.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 bg-yellow-100/80 px-3 py-1 rounded-lg text-yellow-700 font-bold text-sm mb-3">
                      ⭐ {professional.rating ? professional.rating.toFixed(1) : 'New'} 
                    </div>

                    <div className="flex items-center text-gray-500 text-sm font-medium">
                      <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {professional.location || 'Location hidden'}
                    </div>

                    <div className="mt-6 w-full px-4">
                      <button 
                        onClick={() => navigate(`/user/${professional._id}`)}
                        className="w-full py-2.5 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
                      >
                        Visit Profile
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Service Details */}
                  <div className="flex-1 p-8 sm:p-10 flex flex-col relative">
                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 bg-emerald-100/50 px-4 py-1.5 rounded-full">
                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Completed</span>
                    </div>

                    <div className="mb-2 inline-flex items-center gap-2 text-gray-400 font-semibold text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Finished on {dateFinished}
                    </div>

                    <h4 className="text-3xl font-black text-gray-900 mb-4 pr-24 tracking-tight leading-tight">
                      {requestContext.title}
                    </h4>
                    
                    <p className="text-gray-600 leading-relaxed font-medium mb-8 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 italic">
                      "{requestContext.description}"
                    </p>

                    <div className="mt-auto flex flex-col sm:flex-row gap-4 justify-between items-center bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Final Budget</span>
                         <span className="text-2xl font-black text-emerald-600">₹{requestContext.budget.toLocaleString()}</span>
                      </div>
                      
                      <button 
                         onClick={() => navigate('/post-request')}
                         className="group flex-shrink-0 relative inline-flex items-center justify-center px-8 py-3.5 font-black text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[1.25rem] hover:scale-105 hover:-translate-y-1 shadow-lg shadow-emerald-500/30 overflow-hidden w-full sm:w-auto"
                      >
                         <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                         <span className="relative flex items-center gap-2">
                            <span className="text-xl">🤝</span> Rehire {professional.name.split(' ')[0]}
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
