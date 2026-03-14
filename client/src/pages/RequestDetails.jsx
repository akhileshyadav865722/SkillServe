import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
        const res = await axios.get(`http://localhost:5000/api/requests/${id}`);
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
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`, {
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
      await axios.post(`http://localhost:5000/api/requests/${id}/apply`, {}, {
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
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
  
  if (!request) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Request Not Found</h3>
        <p>The service request you are looking for does not exist.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{request.title}</h2>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
          request.status === 'open' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 
          request.status === 'in-progress' ? 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' : 
          'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-500/10'
        }`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="card mb-8">
        <div className="px-6 py-8 sm:p-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Job Details</h3>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600 font-medium text-sm">Category</dt>
                  <dd className="text-gray-900 font-semibold text-sm">{request.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 font-medium text-sm">Budget</dt>
                  <dd className="text-gray-900 font-bold text-lg text-primary-600">${request.budget}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 font-medium text-sm">Location</dt>
                  <dd className="text-gray-900 font-medium text-sm">{request.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 font-medium text-sm">Deadline</dt>
                  <dd className="text-gray-900 font-medium text-sm">{new Date(request.deadline).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Client Information</h3>
              <Link to={`/user/${request.createdBy?._id}`} className="group flex items-center gap-4 hover:bg-gray-50 p-2 -ml-2 rounded-xl transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  {request.createdBy?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{request.createdBy?.name}</p>
                  <p className="text-sm text-gray-500">Posted on {new Date(request.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {request.requiredSkills && request.requiredSkills.length > 0 && (
          <div className="bg-gray-50/80 px-6 py-6 sm:px-10 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {request.requiredSkills.map((skill, index) => (
                <span key={index} className="inline-flex items-center rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-primary-700 border border-primary-100 shadow-sm transition-transform hover:-translate-y-0.5">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 mt-8">
        <button 
          onClick={() => navigate('/requests')}
          className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Back to list
        </button>
        {user?.role === 'professional' && (
          <button 
            onClick={handleApply}
            disabled={request.status !== 'open'}
            className="btn-primary"
          >
            {request.status !== 'open' ? 'Job Unavailable' : 'Apply for this Job'}
          </button>
        )}
        
        {user?._id === request.createdBy?._id && (
          <button onClick={handleDelete} className="btn-danger">
            Delete Request
          </button>
        )}
      </div>
    </div>
  );
}

export default RequestDetails;
