import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function PostRequest() {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', requiredSkills: '', budget: '', location: '', deadline: ''
  });
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user || user.role !== 'client') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg max-w-md">
          <h3 className="text-lg font-bold mb-2">Access Denied</h3>
          <p>Only clients can post service requests.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
        budget: Number(formData.budget)
      };
      
      await axios.post('http://localhost:5000/api/requests', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post request');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Post a Service Request
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide details about the job you need completed.
          </p>
        </div>
      </div>

      <div className="card shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Job Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="input-field"
                  placeholder="e.g. Need a Master Plumber ASAP"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="input-field"
                  placeholder="Describe the problem, timeline, and expectations."
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Give professionals a clear picture of what you need.</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Category
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="category"
                  id="category"
                  className="input-field"
                  placeholder="e.g. Home Improvement"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="budget" className="block text-sm font-medium leading-6 text-gray-900">
                Budget
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  className="input-field pl-7"
                  placeholder="0.00"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="requiredSkills" className="block text-sm font-medium leading-6 text-gray-900">
                Required Skills (Comma separated)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="requiredSkills"
                  id="requiredSkills"
                  className="input-field"
                  placeholder="e.g. Plastering, Painting, Wiring"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                Location
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="input-field"
                  placeholder="City, State, or Remote"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                Deadline
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostRequest;
