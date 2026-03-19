import { useNavigate } from 'react-router-dom';

export default function NavigationArrows() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-24 left-0 w-full px-2 sm:px-6 md:px-8 lg:px-10 flex justify-between items-center pointer-events-none z-40 transition-all duration-300">
      <button 
        onClick={() => navigate(-1)}
        className="pointer-events-auto flex items-center justify-center gap-1.5 group text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-all duration-300 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[var(--color-primary)]/10 border border-gray-200/50 hover:border-[var(--color-primary)]/30 hover:-translate-x-1"
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:block">Back</span>
      </button>

      <button 
        onClick={() => navigate(1)}
        className="pointer-events-auto flex items-center justify-center gap-1.5 group text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-all duration-300 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[var(--color-primary)]/10 border border-gray-200/50 hover:border-[var(--color-primary)]/30 hover:translate-x-1"
        title="Go Forward"
      >
        <span className="hidden sm:block">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
