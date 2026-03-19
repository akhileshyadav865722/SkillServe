import { useState } from 'react';
import weddingImg from '../assets/images/wedding.webp';
import birthdayImg from '../assets/images/birthday.jpg';
import corporateImg from '../assets/images/cooperate.jpg';
import constructionImg from '../assets/images/construction.jpeg';
import landscapingImg from '../assets/images/land escaping.jpg';
import farmManageImg from '../assets/images/farm manage.webp';
import agricultureImg from '../assets/images/aggrictulture.jpg';
import renovationImg from '../assets/images/renovatio.jpg';
import environmentImg from '../assets/images/enviroment.jpg';
import maintenanceImg from '../assets/images/maintance.jpg';

// Hardcoded package data for beautiful UI
const packagesData = [
  {
    id: 1,
    name: 'Wedding Planner',
    price: '₹25,000',
    services: ['Venue arrangement', 'Decoration setup', 'Catering services', 'Photography', 'DJ and music', 'Guest management'],
    image: weddingImg,
    gradient: 'from-[#C084FC] to-[#F472B6]', // Purple to Pink
  },
  {
    id: 2,
    name: 'Birthday Party Planner',
    price: '₹10,000',
    services: ['Theme decoration', 'Custom cake & desserts', 'Entertainment & Games', 'Food & Beverages', 'Return gifts', 'Event Photography'],
    image: birthdayImg,
    gradient: 'from-[#FACA15] to-[#FCA5A5]', // Yellow to Red
  },
  {
    id: 3,
    name: 'Corporate Event Planner',
    price: '₹50,000',
    services: ['AV & Tech Setup', 'Catering & Beverages', 'Seating & Layout Design', 'Registration Desk Management', 'Logistics & Transport', 'Branding materials'],
    image: corporateImg,
    gradient: 'from-[#38BDF8] to-[#818CF8]', // Blue to Indigo
  },
  {
    id: 4,
    name: 'House Construction Planner',
    price: '₹1,00,000',
    services: ['Architectural design', 'Labor contracting', 'Material procurement', 'Building permits', 'Timeline management', 'Quality control inspections'],
    image: constructionImg,
    gradient: 'from-[#F87171] to-[#FB923C]', // Red to Orange
  },
  {
    id: 5,
    name: 'Landscaping Planner',
    price: '₹30,000',
    services: ['Site analysis & design', 'Plant selection & procurement', 'Irrigation installation', 'Hardscaping (patios/walkways)', 'Outdoor lighting', 'Soil preparation'],
    image: landscapingImg,
    gradient: 'from-[#4ADE80] to-[#2DD4BF]', // Green to Teal
  },
  {
    id: 6,
    name: 'Farm Management Planner',
    price: '₹40,000',
    services: ['Crop planning & rotation', 'Resource allocation tracking', 'Soil health testing', 'Labor management', 'Harvesting schedule', 'Machinery maintenance log'],
    image: farmManageImg,
    gradient: 'from-[#A3E635] to-[#4ADE80]', // Lime to Green
  },
  {
    id: 7,
    name: 'Agriculture Planner',
    price: '₹35,000',
    services: ['Yield optimization strategies', 'Drone aerial mapping', 'Seed variety selection', 'Fertilizer application calendar', 'Market trend analysis', 'Water conservation techniques'],
    image: agricultureImg,
    gradient: 'from-[#FACC15] to-[#FDBA74]', // Yellow to Orange-light
  },
  {
    id: 8,
    name: 'Home Renovation Planner',
    price: '₹45,000',
    services: ['Interior design consultation', 'Demolition & debris removal', 'Plumbing & Electrical updates', 'Painting & Finishing touches', 'Furniture sourcing', 'Final inspection & clearing'],
    image: renovationImg,
    gradient: 'from-[#A78BFA] to-[#C084FC]', // Violet to Purple
  },
  {
    id: 9,
    name: 'Environmental Planner',
    price: '₹20,000',
    services: ['Impact assessment reporting', 'Green building certifications', 'Waste management strategies', 'Energy efficiency audit', 'Regulatory compliance check', 'Sustainability impact reporting'],
    image: environmentImg,
    gradient: 'from-[#22D3EE] to-[#38BDF8]', // Cyan to Blue
  },
  {
    id: 10,
    name: 'Home Maintenance Planner',
    price: '₹15,000',
    services: ['Annual structural check', 'Plumbing pipeline inspection', 'HVAC servicing & cleaning', 'Electrical safety audit', 'Pest control treatments', 'Roof & gutter clearing'],
    image: maintenanceImg,
    gradient: 'from-[#94A3B8] to-[#CBD5E1]', // Slate to lighter slate
  }
];

function PlannerPackages() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Close modal functionality
  const closeModal = () => setSelectedPackage(null);

  return (
    <div className="bg-gray-50 min-h-screen py-16 sm:py-24 relative overflow-hidden isolate">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-pink-200 to-purple-200 opacity-40 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200 to-teal-200 opacity-30 rounded-full blur-[80px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 text-sm font-bold tracking-widest uppercase mb-4 shadow-sm border border-purple-200">
            Premium Services
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Expert Planner <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Packages</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium leading-relaxed">
            From weddings to massive corporate events, find perfectly crafted service bundles wrapped up completely ready to go.
          </p>
        </div>

        {/* 2-Column Grid for Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {packagesData.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group relative rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transform transition-all duration-300 bg-white cursor-pointer h-[400px] sm:h-[450px]"
              onClick={() => setSelectedPackage(pkg)}
            >
              {/* Image filling the card */}
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              
              {/* Dual Gradients for bottom text readability and top overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Inner Focus Border on Hover */}
              <div className="absolute inset-4 rounded-[24px] border border-white/0 group-hover:border-white/20 transition-colors duration-300 pointer-events-none"></div>

              {/* Bottom Information Strip */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg transition-transform duration-300">
                <div className="relative z-10 flex-1 pr-2">
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1 drop-shadow-md tracking-wide leading-tight line-clamp-2">{pkg.name}</h3>
                  <p className="text-white/90 font-bold text-sm flex items-center gap-1.5">
                    <span className="block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Starting from {pkg.price}
                  </p>
                </div>
                
                {/* Get Package Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents double firing modal since the whole card is clickable initially!
                    setSelectedPackage(pkg);
                  }}
                  className={`relative overflow-hidden bg-gradient-to-r ${pkg.gradient} text-white font-black py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 group/btn border border-white/20 sm:w-auto w-full`}
                >
                  <span className="relative z-10 text-sm">Get Package</span>
                  <svg className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Detail Modal Overlay */}
      {selectedPackage && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md transition-all duration-300 animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-[40px] p-8 sm:p-12 w-full max-w-2xl shadow-2xl transform animate-slide-up relative overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            {/* Top Right Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 rounded-full bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 pr-10 leading-tight tracking-tight">
              {selectedPackage.name}
            </h3>
            <p className="inline-block px-4 py-1.5 bg-gray-100 rounded-lg text-2xl font-black text-[var(--color-primary)] mb-8 border border-gray-200/50 shadow-inner">
              {selectedPackage.price}
            </p>
            
            {/* Services Checklist */}
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100/80 shadow-inner mb-8">
              <h4 className="text-xl font-black text-gray-800 mb-5 border-b border-gray-200/60 pb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Package Includes
              </h4>
              <ul className="space-y-4">
                {selectedPackage.services.map((service, i) => (
                  <li key={i} className="flex items-start gap-3.5 group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-bold text-lg leading-relaxed group-hover:text-gray-900 transition-colors">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
               <button onClick={() => alert("Redirecting to booking workflow...")} className={`flex-1 bg-gradient-to-r ${selectedPackage.gradient} text-white font-black py-4 sm:py-5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg border border-white/20 uppercase tracking-widest`}>
                 Proceed to Booking
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default PlannerPackages;
