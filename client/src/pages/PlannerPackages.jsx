import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { addNotification } from '../store/notificationSlice';
import weddingImg from '../assets/images/wedding.webp';
import birthdayImg from '../assets/images/birthday.jpg';
import corporateImg from '../assets/images/cooperate.jpg';
import constructionImg from '../assets/images/construction.jpeg';
import landscapingImg from '../assets/images/land escaping.jpg';
import farmManageImg from '../assets/images/farm manage.webp';
import agricultureImg from '../assets/images/enviroment.jpg';
import renovationImg from '../assets/images/renovatio.jpg';
import environmentImg from '../assets/images/enviroment.jpg';
import maintenanceImg from '../assets/images/maintance.jpg';

// Retaining cool gradients but optimizing for light mode popup overlays
const packagesData = [
  {
    id: 1,
    name: 'Wedding Planner',
    price: '₹25,000',
    services: ['Venue arrangement', 'Decoration setup', 'Catering services', 'Photography', 'DJ and music', 'Guest management'],
    image: weddingImg,
    gradient: 'from-blue-600 to-cyan-500', 
  },
  {
    id: 2,
    name: 'Birthday Party Planner',
    price: '₹10,000',
    services: ['Theme decoration', 'Custom cake & desserts', 'Entertainment & Games', 'Food & Beverages', 'Return gifts', 'Event Photography'],
    image: birthdayImg,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 3,
    name: 'Corporate Event Planner',
    price: '₹50,000',
    services: ['AV & Tech Setup', 'Catering & Beverages', 'Seating & Layout Design', 'Registration Desk Management', 'Logistics & Transport', 'Branding materials'],
    image: corporateImg,
    gradient: 'from-cyan-500 to-teal-400',
  },
  {
    id: 4,
    name: 'House Construction Planner',
    price: '₹1,00,000',
    services: ['Architectural design', 'Labor contracting', 'Material procurement', 'Building permits', 'Timeline management', 'Quality control inspections'],
    image: constructionImg,
    gradient: 'from-indigo-600 to-blue-600',
  },
  {
    id: 5,
    name: 'Landscaping Planner',
    price: '₹30,000',
    services: ['Site analysis & design', 'Plant selection & procurement', 'Irrigation installation', 'Hardscaping (patios/walkways)', 'Outdoor lighting', 'Soil preparation'],
    image: landscapingImg,
    gradient: 'from-teal-500 to-emerald-400',
  },
  {
    id: 6,
    name: 'Farm Management Planner',
    price: '₹40,000',
    services: ['Crop planning & rotation', 'Resource allocation tracking', 'Soil health testing', 'Labor management', 'Harvesting schedule', 'Machinery maintenance log'],
    image: farmManageImg,
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    id: 7,
    name: 'Agriculture Planner',
    price: '₹35,000',
    services: ['Yield optimization strategies', 'Drone aerial mapping', 'Seed variety selection', 'Fertilizer application calendar', 'Market trend analysis', 'Water conservation techniques'],
    image: agricultureImg,
    gradient: 'from-cyan-600 to-blue-500',
  },
  {
    id: 8,
    name: 'Home Renovation Planner',
    price: '₹45,000',
    services: ['Interior design consultation', 'Demolition & debris removal', 'Plumbing & Electrical updates', 'Painting & Finishing touches', 'Furniture sourcing', 'Final inspection & clearing'],
    image: renovationImg,
    gradient: 'from-indigo-500 to-purple-500', 
  },
  {
    id: 9,
    name: 'Environmental Planner',
    price: '₹20,000',
    services: ['Impact assessment reporting', 'Green building certifications', 'Waste management strategies', 'Energy efficiency audit', 'Regulatory compliance check', 'Sustainability impact reporting'],
    image: environmentImg,
    gradient: 'from-blue-500 to-teal-500',
  },
  {
    id: 10,
    name: 'Home Maintenance Planner',
    price: '₹15,000',
    services: ['Annual structural check', 'Plumbing pipeline inspection', 'HVAC servicing & cleaning', 'Electrical safety audit', 'Pest control treatments', 'Roof & gutter clearing'],
    image: maintenanceImg,
    gradient: 'from-slate-500 to-blue-400',
  }
];

function PlannerPackages() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bookingStep, setBookingStep] = useState('details'); 
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    contact: '',
    address: '',
    date: '',
    days: '1',
    paymentMethod: 'online'
  });

  const handleGetPackage = (e, pkg) => {
    e.stopPropagation();
    if (!user) {
      navigate('?auth=login');
    } else {
      setSelectedPackage(pkg);
      setBookingStep('details');
      setBookingFormData(prev => ({ ...prev, name: user.name || '' }));
    }
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setTimeout(() => {
      setBookingStep('details');
      setBookingFormData(prev => ({ ...prev, contact: '', address: '', date: '', days: '1', paymentMethod: 'online' }));
    }, 500);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setBookingStep('success');
      dispatch(addNotification({
        title: 'Booking Confirmed!',
        message: `You have successfully booked "${selectedPackage.name}" package on ${bookingFormData.date}.`,
        type: 'success',
        icon: 'check-circle'
      }));
    }, 600);
  };

  const filteredPackages = packagesData.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden isolate font-sans">
      
      {/* Light Aurora Decor Background (Matched exactly to Home.jsx) */}
      <div className="fixed top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-indigo-200 to-blue-200 opacity-40 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200 to-teal-100 opacity-30 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

      <div className={`relative w-full transition-all duration-700 ease-in-out py-16 sm:py-24 ${selectedPackage ? 'lg:pr-[450px] xl:pr-[500px]' : ''}`}>
        
        {/* Main Content: Cards Gallery */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out max-w-7xl">
          {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block py-1.5 px-6 rounded-full bg-blue-50/80 backdrop-blur-md text-blue-700 text-sm font-black tracking-widest uppercase mb-6 shadow-sm border border-blue-200/50">
            Premium Services
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Expert Planner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 drop-shadow-sm">Packages</span>
          </h1>
          <p className="text-xl text-slate-600 font-bold leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            From weddings to massive corporate events, find perfectly crafted service bundles wrapped up completely ready to go in a single click.
          </p>
        </div>

        {/* Beautiful Light Search Panel */}
        <div className="max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="relative flex items-center bg-white/80 backdrop-blur-md border-[3px] border-white/60 hover:border-blue-200 focus-within:border-blue-400 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-full p-2.5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="p-3.5 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full text-blue-600 ml-1 border border-white shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search for professional packages... (e.g. Corporate)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none px-6 text-slate-800 text-lg font-bold placeholder-slate-400 focus:ring-0"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors mr-1 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Grid for Cards */}
        {filteredPackages.length > 0 ? (
          <div className={`grid grid-cols-1 ${selectedPackage ? 'xl:grid-cols-2' : 'lg:grid-cols-2'} gap-8 transition-all duration-700`}>
            {filteredPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] hover:-translate-y-2 hover:scale-[1.02] transform transition-all duration-500 bg-white cursor-pointer h-[400px] sm:h-[450px] border border-white"
            >
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-900/80 group-hover:to-slate-900/90 transition-opacity duration-300"></div>
              
              <div className="absolute inset-4 rounded-[24px] border border-white/0 group-hover:border-white/40 transition-colors duration-500 pointer-events-none z-10"></div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl transition-transform duration-300 group-hover:bg-white/20">
                <div className="relative z-10 flex-1 pr-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1 drop-shadow-lg tracking-tight leading-tight line-clamp-2">{pkg.name}</h3>
                  <p className="text-white/90 font-bold text-sm flex items-center gap-2 drop-shadow-sm">
                    <span className="block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                    Starting from {pkg.price}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => handleGetPackage(e, pkg)}
                  className={`relative overflow-hidden bg-gradient-to-r ${pkg.gradient} text-white font-black py-3 px-6 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.05] transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 group/btn border border-white/20 sm:w-auto w-full`}
                >
                  <span className="relative z-10 text-sm tracking-wide">Get Package</span>
                  <svg className="w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/70 rounded-[40px] border border-white backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-3xl mx-auto ring-1 ring-slate-900/5">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-blue-50/50 border border-blue-100 text-blue-400 mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3">No packages found!</h3>
            <p className="text-slate-500 text-xl font-bold">Try searching for something else like "Corporate" or "Wedding".</p>
          </div>
        )}
        </div>
      </div>

      {/* Right Side: Fixed Booking Panel (Drawer) - Light Frosted Glass */}
      <div 
        className={`fixed inset-y-0 right-0 z-[120] w-full sm:w-[500px] xl:w-[500px] h-screen bg-white/95 backdrop-blur-3xl border-l-[3px] border-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden transform transition-all duration-700 ease-in-out ${selectedPackage ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
      >
        {selectedPackage && (
          <div className="h-full flex flex-col p-6 sm:p-8 xl:p-10 relative overflow-y-auto w-full animate-fade-in custom-scrollbar">
            {/* Header inside Panel */}
            <div className="flex justify-between items-start mb-6 sticky top-0 bg-white/95 backdrop-blur-xl pt-10 pb-4 z-20 -mt-10 -mx-6 px-6 xl:-mx-10 xl:px-10 border-b border-slate-100">
              <div className="pr-4">
                <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black tracking-widest uppercase mb-3 shadow-sm">
                  Selected
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                  {selectedPackage.name}
                </h3>
              </div>
              
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="p-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 hover:shadow-sm transition-all focus:outline-none flex-shrink-0"
                title="Close panel"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {bookingStep === 'details' && (
              <div className="flex flex-col flex-1 animate-fade-in relative z-10">
                {/* Cover Image Mini */}
                <div className="w-full h-56 xl:h-64 rounded-[32px] overflow-hidden mb-8 shadow-md relative group border-4 border-white flex-shrink-0 ring-1 ring-slate-100">
                  <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-6">
                    <p className="text-4xl font-black text-white drop-shadow-xl tracking-tight">
                      {selectedPackage.price}
                    </p>
                  </div>
                </div>
                
                {/* Services Checklist */}
                <div className="bg-slate-50/80 rounded-[32px] p-6 xl:p-8 border border-white shadow-sm flex-1 mb-10 ring-1 ring-slate-100">
                  <h4 className="text-2xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-5 flex items-center gap-4">
                    <span className={`w-12 h-12 rounded-[18px] bg-gradient-to-br ${selectedPackage.gradient} text-white flex items-center justify-center shadow-lg`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>
                    </span>
                    Package Includes
                  </h4>
                  <ul className="space-y-5">
                    {selectedPackage.services.map((service, i) => (
                      <li key={i} className="flex items-start gap-4 group mb-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mt-0.5 border border-cyan-100 group-hover:bg-cyan-500 group-hover:block transition-all duration-300 group-hover:text-white shadow-sm group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-600 font-bold leading-relaxed group-hover:text-slate-900 transition-colors text-base xl:text-lg">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto sticky bottom-0 bg-white/95 backdrop-blur-xl pt-4 pb-6 z-20 -mx-6 px-6 xl:-mx-10 xl:px-10 border-t border-slate-100">
                   <button onClick={() => setBookingStep('form')} className={`w-full bg-gradient-to-r ${selectedPackage.gradient} text-white font-black py-5 rounded-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-all duration-300 text-lg border border-white/20 uppercase tracking-widest flex items-center justify-center gap-3 group/btn`}>
                     <span>Proceed to Booking</span>
                     <svg className="w-6 h-6 transform group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
                   </button>
                </div>
              </div>
            )}

            {bookingStep === 'form' && (
              <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 animate-fade-in relative z-10">
                <div className="bg-white rounded-[32px] p-6 xl:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 space-y-6 flex-1 w-full box-border">
                  <h4 className="text-2xl font-black text-slate-900 mb-2 border-b border-slate-100 pb-5 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-[16px] bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                    Your Details
                  </h4>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-black text-slate-600 mb-2 uppercase tracking-wide">Full Name</label>
                      <input required type="text" name="name" value={bookingFormData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all outline-none box-border shadow-inner" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-600 mb-2 uppercase tracking-wide">Contact Number</label>
                      <input required type="tel" name="contact" value={bookingFormData.contact} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all outline-none box-border shadow-inner" placeholder="+91 9876543210" />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-600 mb-2 uppercase tracking-wide">Service Address</label>
                      <textarea required name="address" value={bookingFormData.address} onChange={handleInputChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all outline-none resize-none box-border shadow-inner" placeholder="Full Address..."></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-black text-slate-600 mb-2 uppercase tracking-wide">Date</label>
                        <input required type="date" name="date" value={bookingFormData.date} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all outline-none box-border shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-slate-600 mb-2 uppercase tracking-wide">Duration (Days)</label>
                        <input required type="number" min="1" name="days" value={bookingFormData.days} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all outline-none box-border shadow-inner" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-black text-slate-600 mb-3 uppercase tracking-wide">Payment Method</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingFormData.paymentMethod === 'online' ? 'border-blue-500 bg-blue-50/50 shadow-[0_4px_15px_rgba(59,130,246,0.1)]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <input type="radio" name="paymentMethod" value="online" checked={bookingFormData.paymentMethod === 'online'} onChange={handleInputChange} className="hidden" />
                          <span className={`font-black tracking-wide ${bookingFormData.paymentMethod === 'online' ? 'text-blue-600' : 'text-slate-500'}`}>Online Pay</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingFormData.paymentMethod === 'cash' ? 'border-cyan-500 bg-cyan-50/50 shadow-[0_4px_15px_rgba(6,182,212,0.1)]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <input type="radio" name="paymentMethod" value="cash" checked={bookingFormData.paymentMethod === 'cash'} onChange={handleInputChange} className="hidden" />
                          <span className={`font-black tracking-wide ${bookingFormData.paymentMethod === 'cash' ? 'text-cyan-600' : 'text-slate-500'}`}>Cash</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto sticky bottom-0 bg-white/95 backdrop-blur-xl pt-4 pb-6 z-20 -mx-6 px-6 xl:-mx-10 xl:px-10 border-t border-slate-100 flex gap-4">
                   <button type="button" onClick={() => setBookingStep('details')} className="w-[120px] bg-white border-2 border-slate-200 text-slate-600 font-black py-4 rounded-[20px] hover:bg-slate-50 transition-all duration-300 text-lg shadow-sm">
                     Back
                   </button>
                   <button type="submit" className={`flex-1 bg-gradient-to-r ${selectedPackage.gradient} text-white font-black py-4 rounded-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-all duration-300 text-lg uppercase tracking-widest flex items-center justify-center gap-2 group/btn border border-white/20`}>
                     <span>Confirm & Book</span>
                     <svg className="w-6 h-6 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                   </button>
                </div>
              </form>
            )}

            {bookingStep === 'success' && (
              <div className="flex flex-col items-center justify-center flex-1 animate-fade-in text-center px-4 py-10 my-auto">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-cyan-400 blur-[40px] opacity-30 rounded-full animate-pulse"></div>
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-[32px] rotate-3 flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform relative z-10 border-[3px] border-white">
                    <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h2>
                <p className="text-slate-600 text-lg font-bold mb-10 leading-relaxed max-w-[320px]">
                  Your request for <span className="text-slate-900">"{selectedPackage.name}"</span> has been placed successfully. Our team will contact you shortly!
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 w-full mb-10 text-left space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Contact</span>
                    <span className="text-slate-900 font-bold">{bookingFormData.contact}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Date</span>
                    <span className="text-slate-900 font-bold">{bookingFormData.date}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-4">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Total Est.</span>
                    <span className="text-blue-600 text-2xl font-black">{selectedPackage.price}</span>
                  </div>
                </div>
                
                <button onClick={closeModal} className={`w-full bg-slate-900 text-white font-black py-4 rounded-[20px] shadow-xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 text-lg uppercase tracking-widest`}>
                  Done
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default PlannerPackages;
