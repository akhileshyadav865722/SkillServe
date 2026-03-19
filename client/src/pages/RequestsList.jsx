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
        headers: { Authorization: `Bearer ${user.token || localStorage.getItem('token')}` }
      });
      alert('Successfully applied to request!');
      
      // Optionally update local state here to reflect applied status
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
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Available Service Requests</h2>
        <p className="mt-4 text-lg text-gray-600">Browse and apply for opportunities that match your skills.</p>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No requests</h3>
          <p className="mt-1 text-sm text-gray-500">There are no service requests available at the moment.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {requests.map(req => (
            <div key={req._id} className="glass group relative flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 rounded-[24px] border border-white/60 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="flex-1 min-w-0 pr-0 md:pr-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-primary)]/20">
                    {req.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Deadline: {new Date(req.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[var(--color-primary)] transition-colors mb-4 line-clamp-2">{req.title}</h3>
                
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 mb-5">
                  <div className="flex items-center bg-white/60 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    <svg className="mr-2 h-4 w-4 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{req.location}</span>
                  </div>
                  <div className="flex items-center bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                    <svg className="mr-2 h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-emerald-700">Budget: ${req.budget}</span>
                  </div>
                </div>
                
                {req.requiredSkills && req.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {req.requiredSkills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-500 border border-gray-200 transition-colors group-hover:bg-white group-hover:border-[var(--color-primary)]/20 group-hover:text-gray-700">
                        {skill}
                      </span>
                    ))}
                    {req.requiredSkills.length > 5 && (
                      <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 border border-gray-200">
                        +{req.requiredSkills.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 md:mt-0 flex flex-row md:flex-col gap-3 min-w-[200px] shrink-0 border-t md:border-t-0 md:border-l border-gray-100/80 pt-5 md:pt-0 md:pl-8 relative z-10">
                <Link 
                  to={`/requests/${req._id}`} 
                  className="btn-outline flex-1 md:flex-none py-3 text-center w-full justify-center group/btn hover:bg-gray-50"
                >
                  View Details
                  <svg className="w-4 h-4 ml-2 inline-block transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
                
                {user?.role === 'professional' && (
                  <button 
                    onClick={() => handleApply(req._id)}
                    className="btn-primary flex-1 md:flex-none py-3 w-full shadow-md shadow-[var(--color-primary)]/20 hover:shadow-lg hover:shadow-[var(--color-primary)]/40 hover:-translate-y-0.5 transition-all outline-none"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestsList;
