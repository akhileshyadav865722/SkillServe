import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/notificationSlice';
import axios from 'axios';

function QuickHire() {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Available locations map (we extract unique locations from the data or provide a static list)
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/professionals');
        setProfessionals(response.data);
        setFilteredProfessionals(response.data);
        
        // Extract unique locations from the professionals
        const uniqueLocations = [...new Set(response.data.map(p => p.location).filter(loc => loc))];
        setLocations(uniqueLocations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('Failed to load professionals. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Filter functionality
  useEffect(() => {
    if (selectedLocation === '') {
      setFilteredProfessionals(professionals);
    } else {
      setFilteredProfessionals(professionals.filter(p => p.location === selectedLocation));
    }
  }, [selectedLocation, professionals]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 relative overflow-hidden isolate">
      {/* Premium Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200 to-indigo-200 opacity-40 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-200 to-pink-200 opacity-30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-widest uppercase mb-4 shadow-sm border border-blue-200">
            Direct Hiring
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hire</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Browse our top-rated professionals and hire them directly for your projects without posting a request.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-4 sm:p-6 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <span className="font-bold text-gray-700 text-lg">Filter by Location:</span>
          </div>
          
          <div className="w-full sm:w-[300px] relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-5 py-3.5 pr-10 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer transition-all hover:bg-gray-50"
            >
              <option value="">All Locations</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold border border-red-100 shadow-sm">
            {error}
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-12 text-center shadow-lg border border-white/50">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">No professionals found</h3>
            <p className="text-gray-500 font-medium">Try changing your location filter or checking back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {filteredProfessionals.map((prof) => (
              <div 
                key={prof._id} 
                className="bg-white/80 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] border border-white hover:border-blue-100 transition-all duration-300 group flex flex-col sm:flex-row items-center sm:items-stretch gap-6"
              >
                {/* Avatar Section */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 shadow-md relative group-hover:scale-105 transition-transform duration-300">
                    {prof.profileImage ? (
                      <img src={`http://localhost:5000${prof.profileImage}`} alt={prof.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 font-black text-4xl">
                        {prof.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Verified Badge */}
                  <div className="absolute -bottom-3 -right-3 bg-white p-1 rounded-full shadow-lg" title="Verified Professional">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{prof.name}</h3>
                    <div className="flex items-center justify-center sm:justify-end gap-1 mt-2 sm:mt-0 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span className="font-bold text-gray-800">{prof.rating ? prof.rating.toFixed(1) : 'New'}</span>
                      <span className="text-xs text-gray-500 ml-1">({prof.numReviews || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm font-semibold mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {prof.location ? prof.location : 'Location Not Provided'}
                    <span className="mx-2 text-gray-300">|</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    {prof.experience} years exp
                  </div>

                  {prof.skills && prof.skills.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                      {prof.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                      {prof.skills.length > 4 && (
                        <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 text-xs font-bold rounded-lg">
                          +{prof.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                <div className="flex flex-col justify-center sm:border-l sm:border-gray-100 sm:pl-6 gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <Link 
                    to={`/user/${prof._id}`}
                    className="w-full sm:w-32 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-center transition-all duration-300 hover:shadow-sm"
                  >
                    View Profile
                  </Link>
                  <button 
                    onClick={() => {
                      if (!user) {
                        navigate('?auth=login');
                      } else {
                        dispatch(addNotification({
                          title: 'Hire Request Sent!',
                          message: `Your request to hire ${prof.name} has been sent successfully. They will review it shortly.`,
                          type: 'success',
                          icon: 'briefcase'
                        }));
                      }
                    }}
                    className="w-full sm:w-32 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-center shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       Hire Now
                       <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickHire;
