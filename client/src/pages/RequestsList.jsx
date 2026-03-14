import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/requests');
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
      await axios.post(`http://localhost:5000/api/requests/${requestId}/apply`, {}, {
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map(req => (
            <div key={req._id} className="card group flex flex-col justify-between hover:border-primary-200">
              <div className="p-7">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors">{req.title}</h3>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 lg:px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 whitespace-nowrap ml-2 shadow-sm">
                    {req.category}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Deadline: {new Date(req.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {req.location}
                  </div>
                  <div className="flex items-center font-medium text-gray-900">
                    <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${req.budget}
                  </div>
                </div>
                
                {req.requiredSkills && req.requiredSkills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {req.requiredSkills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50/50 px-7 py-5 flex gap-4 border-t border-gray-100 mt-auto">
                <Link 
                  to={`/requests/${req._id}`} 
                  className="btn-outline flex-1 text-center py-2"
                >
                  View Details
                </Link>
                
                {user?.role === 'professional' && (
                  <button 
                    onClick={() => handleApply(req._id)}
                    className="btn-primary flex-1 py-2"
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
