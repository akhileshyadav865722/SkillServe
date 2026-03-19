import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
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
      
      await api.post('/requests', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post request');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative perspective-1000">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[var(--color-primary)] to-transparent rounded-full blur-[80px] opacity-30 -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[var(--color-secondary)] to-transparent rounded-full blur-[100px] opacity-20 -z-10"></div>

      <div className="text-center mb-10 transform transition-all duration-700 hover:scale-105">
        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-black text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-primary)]/20 mb-4 shadow-sm">
          Hire Top Talent
        </span>
        <h2 className="text-4xl md:text-5xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-[var(--color-primary)] to-[var(--color-secondary)] tracking-tight drop-shadow-sm">
          Post a Service Request
        </h2>
        <p className="mt-4 text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          Describe the job you need perfectly done, set your budget, and get connected with the best professionals in seconds.
        </p>
      </div>

      <div className="glass rounded-[32px] border border-white/60 p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-[var(--color-primary)]/10 transform transition-all hover:shadow-[var(--color-primary)]/20 duration-500">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-transparent opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-transparent opacity-20 blur-3xl pointer-events-none"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
            
            {/* Full Width Line */}
            <div className="sm:col-span-2 group">
              <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-primary)] transition-colors">
                Job Title ✨
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent px-5 py-4 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none font-medium text-lg"
                  placeholder="e.g. Need a Master Plumber ASAP"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Full Width Line */}
            <div className="sm:col-span-2 group">
              <label htmlFor="description" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-primary)] transition-colors">
                Job Description 📝
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent px-5 py-4 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none resize-none font-medium leading-relaxed"
                  placeholder="Describe the problem, timeline, and exact expectations..."
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Half Width Lines */}
            <div className="group">
              <label htmlFor="category" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-primary)] transition-colors">
                Category 🏷️
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent px-5 py-3.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none font-medium"
                placeholder="e.g. Home Improvement"
                onChange={handleChange}
                required
              />
            </div>

            <div className="group">
              <label htmlFor="budget" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-secondary)] transition-colors">
                Budget 💰
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                  <span className="text-gray-500 font-bold sm:text-lg">$</span>
                </div>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent pl-10 pr-5 py-3.5 text-gray-900 placeholder-gray-400 focus:border-[var(--color-secondary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-secondary)]/10 transition-all outline-none font-bold text-lg"
                  placeholder="0.00"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Full Width Line */}
            <div className="sm:col-span-2 group">
              <label htmlFor="requiredSkills" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-primary)] transition-colors">
                Required Skills 🎯 <span className="text-gray-400 text-xs font-normal ml-1">(Comma separated)</span>
              </label>
              <input
                type="text"
                name="requiredSkills"
                id="requiredSkills"
                className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent px-5 py-3.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none font-medium"
                placeholder="e.g. Plastering, Painting, Wiring"
                onChange={handleChange}
              />
            </div>

            {/* Half Width Lines */}
            <div className="group">
              <label htmlFor="location" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-primary)] transition-colors">
                Location 📍
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent px-5 py-3.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none font-medium"
                placeholder="City, State, or Remote"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="group">
              <label htmlFor="deadline" className="block text-sm font-bold leading-6 text-gray-800 mb-2 group-focus-within:text-[var(--color-primary)] transition-colors">
                Deadline ⏳
              </label>
              <input
                type="date"
                name="deadline"
                id="deadline"
                className="w-full bg-white/70 backdrop-blur-md rounded-2xl border-2 border-transparent px-5 py-3.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none font-medium"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-4 items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 focus:ring-4 focus:ring-gray-100 outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-black text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] shadow-xl shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50 flex items-center justify-center gap-2 group/btn"
            >
              <span>Publish Request</span>
              <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostRequest;
