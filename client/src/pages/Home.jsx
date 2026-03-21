import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden isolate font-sans">
      
      <style>{`
        @keyframes custom-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.15), 0 8px 10px -6px rgba(37, 99, 235, 0.1); }
          50% { transform: translateY(-15px) rotate(1deg); box-shadow: 0 25px 45px -5px rgba(37, 99, 235, 0.2), 0 8px 10px -6px rgba(37, 99, 235, 0.1); }
        }
        @keyframes custom-float-delayed {
          0%, 100% { transform: translateY(0) rotate(1deg); box-shadow: 0 15px 35px -5px rgba(6, 182, 212, 0.15), 0 8px 10px -6px rgba(6, 182, 212, 0.1); }
          50% { transform: translateY(-10px) rotate(-1deg); box-shadow: 0 25px 45px -5px rgba(6, 182, 212, 0.2), 0 8px 10px -6px rgba(6, 182, 212, 0.1); }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .anim-float { animation: custom-float 6s ease-in-out infinite; }
        .anim-float-delayed { animation: custom-float-delayed 7s ease-in-out infinite 1s; }
        .anim-dash { animation: dash-flow 1.5s linear infinite; }
        .anim-blob { animation: blob 10s infinite alternate; }
      `}</style>

      {/* Extreme Bright Light Background Decor */}
      <div className="fixed top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-400 to-cyan-300 opacity-20 rounded-full blur-[100px] pointer-events-none -z-10 anim-blob text-blue-500"></div>
      <div className="fixed bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400 to-emerald-300 opacity-20 rounded-full blur-[100px] pointer-events-none -z-10 anim-blob text-cyan-500" style={{ animationDelay: '2s' }}></div>

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-2 px-6 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-[11px] font-black tracking-widest uppercase mb-8">
              Welcome to SkillServe
            </span>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
              The premier network for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 drop-shadow-sm">elite professionals.</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 font-bold leading-relaxed max-w-3xl mx-auto mb-12">
              Connect with top-tier talent for your most critical projects. Experience a secure, vibrant, and frictionless hiring process.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {!user ? (
                <>
                  <Link to="?auth=register" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black rounded-[24px] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)] transition-all text-xl flex items-center justify-center gap-3">
                    Start Hiring Talent
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                  <Link to="/requests" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-800 font-black rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:text-blue-600 transition-all text-xl flex items-center justify-center gap-3">
                    Explore Services
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black rounded-[24px] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)] transition-all text-xl flex items-center justify-center gap-3">
                    Go to Workspace
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                  {user.role === 'client' && (
                    <Link to="/post-request" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-800 font-black rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:text-blue-600 transition-all text-xl flex items-center justify-center gap-3">
                       Create New Project
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mockup - Bright Version */}
        <div className="max-w-[1000px] mx-auto px-4 mt-20 relative z-10">
          <div className="relative rounded-[32px] sm:rounded-[40px] bg-slate-100/50 backdrop-blur-2xl border-4 border-white shadow-[0_30px_60px_rgba(37,99,235,0.15)] p-2 pb-0 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
             
             {/* Glowing element behind the mockup */}
             <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] bg-blue-300/30 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

             {/* Mock Browser Header */}
             <div className="flex items-center gap-2 px-6 py-4 border-b border-white bg-white/60 backdrop-blur-md">
               <div className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-sm border border-white"></div>
               <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm border border-white"></div>
               <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm border border-white"></div>
               <div className="ml-4 flex-1 max-w-xs h-7 bg-slate-100/50 rounded-full border border-slate-200"></div>
             </div>
             
             {/* Mock App Content */}
             <div className="bg-white/80 p-6 sm:p-10 border-t border-white pb-20 relative backdrop-blur-md">
               <div className="flex flex-col sm:flex-row gap-6">
                 <div className="w-full sm:w-1/3 space-y-4">
                   <div className="h-24 bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 hover:border-blue-200 transition-colors">
                     <div className="w-10 h-10 rounded-[12px] bg-blue-100 text-blue-600 font-black flex items-center justify-center mb-4">S</div>
                     <div className="w-2/3 h-3 bg-slate-200 rounded-full mb-2"></div>
                     <div className="w-1/2 h-2.5 bg-slate-100 rounded-full"></div>
                   </div>
                   <div className="h-32 bg-blue-600 border border-blue-400 rounded-[24px] shadow-[0_15px_30px_rgba(37,99,235,0.3)] p-6 relative overflow-hidden">
                     <div className="absolute right-0 top-0 w-32 h-32 bg-blue-400/30 rounded-full blur-xl mix-blend-screen"></div>
                     <div className="w-1/3 h-4 bg-white/80 rounded-full mb-4 relative z-10"></div>
                     <div className="w-3/4 h-3 bg-white/50 rounded-full mb-5 relative z-10"></div>
                     <div className="w-2/3 h-10 bg-cyan-400 rounded-full text-center flex items-center justify-center font-black text-white uppercase tracking-wider shadow-lg shadow-cyan-400/50 relative z-10 border border-cyan-300 text-xs">Execute</div>
                   </div>
                 </div>
                 
                 <div className="w-full sm:w-2/3">
                   <div className="h-full bg-white border border-slate-100 rounded-[32px] shadow-lg p-6 sm:p-8 relative">
                     <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-5">
                       <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-[18px] border-2 border-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] flex items-center justify-center text-white font-black text-xl">PT</div>
                         <div>
                           <div className="w-32 h-4 bg-slate-800 rounded-full mb-2"></div>
                           <div className="w-20 h-3 bg-slate-300 rounded-full"></div>
                         </div>
                       </div>
                       <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black shadow-sm tracking-wide">Verified Exec</div>
                     </div>
                     <div className="w-full h-3.5 bg-slate-100 rounded-full mb-4 mt-8"></div>
                     <div className="w-full h-3.5 bg-slate-100 rounded-full mb-4"></div>
                     <div className="w-4/5 h-3.5 bg-slate-100 rounded-full mb-8"></div>
                     <div className="flex gap-4">
                       <div className="w-24 h-8 bg-blue-100 border border-blue-200 text-blue-700 rounded-full"></div>
                       <div className="w-28 h-8 bg-cyan-100 border border-cyan-200 text-cyan-700 rounded-full"></div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- TRUSTED BY --- */}
      <div className="max-w-7xl mx-auto px-4 text-center mt-10 relative z-10">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10">Trusted by serious & forward-thinking teams worldwide</p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-70 hover:opacity-100 transition-all duration-700">
          <span className="text-3xl font-black font-serif text-blue-700">Acmecorp</span>
          <span className="text-3xl font-black tracking-tighter text-cyan-600">Globex</span>
          <span className="text-3xl font-bold font-mono text-emerald-600">Soylent</span>
          <span className="text-3xl font-extrabold italic text-indigo-700">Initech</span>
          <span className="text-3xl font-black tracking-widest uppercase text-slate-800">Umbrella</span>
        </div>
      </div>

      {/* --- BRIGHT FEATURES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="inline-block py-2 px-6 rounded-full bg-blue-100 border-2 border-blue-300 text-blue-700 text-xs font-black tracking-[0.2em] uppercase mb-6 shadow-sm">
            Why Choose Us
          </span>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8">
            A platform engineered for <span className="text-blue-600">serious output.</span>
          </h3>
          <p className="mt-6 text-xl sm:text-2xl text-slate-600 font-bold max-w-3xl mx-auto">
            We obsess over the details so you can focus on getting the job done right. Everything is bright, loud, and incredibly functional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border-2 border-slate-100 hover:border-blue-400 rounded-[40px] p-10 sm:p-12 shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] transition-all duration-500 transform hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-[24px] flex items-center justify-center mb-10 shadow-[0_10px_25px_rgba(37,99,235,0.4)] group-hover:-translate-y-2 group-hover:bg-blue-500 transition-all duration-300 border border-blue-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">Vetted Excellence</h4>
            <p className="text-slate-500 font-bold text-lg leading-relaxed">Every professional undergoes a strict review process. You only interact with top-tier talent dedicated to quality.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border-2 border-slate-100 hover:border-cyan-400 rounded-[40px] p-10 sm:p-12 shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-cyan-500 text-white rounded-[24px] flex items-center justify-center mb-10 shadow-[0_10px_25px_rgba(6,182,212,0.4)] group-hover:-translate-y-2 group-hover:bg-cyan-400 transition-all duration-300 border border-cyan-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-cyan-600 transition-colors">Secure Escrow</h4>
            <p className="text-slate-500 font-bold text-lg leading-relaxed">Your funds are held securely and only released when milestones are met. Total financial peace of mind.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border-2 border-slate-100 hover:border-emerald-400 rounded-[40px] p-10 sm:p-12 shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-500 transform hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center mb-10 shadow-[0_10px_25px_rgba(16,185,129,0.4)] group-hover:-translate-y-2 group-hover:bg-emerald-400 transition-all duration-300 border border-emerald-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-emerald-500 transition-colors">Live Collaboration</h4>
            <p className="text-slate-500 font-bold text-lg leading-relaxed">Built-in real-time chat and file sharing keeps projects moving swiftly. No messy email threads.</p>
          </div>
        </div>
      </div>

      {/* --- BRIGHT HOW IT WORKS --- */}
      <div className="py-32 relative overflow-hidden bg-white border-y border-slate-100">
        
        {/* Background Accent */}
        <div className="absolute inset-0 bg-blue-50/50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="w-full lg:w-1/2">
              <span className="inline-block py-2 px-6 rounded-full bg-cyan-100 border-2 border-cyan-300 text-cyan-700 text-xs font-black tracking-[0.2em] uppercase mb-8 shadow-sm">
                How It Works
              </span>
              <h2 className="text-5xl sm:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                Simplicity meets <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">sophistication.</span>
              </h2>
              <p className="text-2xl text-slate-600 font-bold mb-12">We've refined the hiring pipeline down to a flawless 3-step process.</p>
              
              <div className="space-y-10 border-l-[3px] border-slate-200 pl-8 relative">
                
                <div className="relative group">
                  <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] border-[4px] border-white flex items-center justify-center text-white font-black group-hover:scale-125 transition-transform">1</div>
                  <h4 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">Publish Request</h4>
                  <p className="text-slate-500 font-bold leading-relaxed text-lg">Describe your needs using our guided forms. Your project instantly reaches experts.</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[4px] border-white flex items-center justify-center text-white font-black group-hover:scale-125 transition-transform">2</div>
                  <h4 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Review Talent</h4>
                  <p className="text-slate-500 font-bold leading-relaxed text-lg">Review comprehensive profiles, verified work history, and client reviews.</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-[4px] border-white flex items-center justify-center text-white font-black group-hover:scale-125 transition-transform">3</div>
                  <h4 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-emerald-500 transition-colors">Engage & Execute</h4>
                  <p className="text-slate-500 font-bold leading-relaxed text-lg">Confirm the hire, open a dedicated workspace, and watch your vision become a reality.</p>
                </div>

              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-emerald-400 transform translate-x-6 translate-y-6 rounded-[48px] -z-10 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500 blur-md opacity-80"></div>
               
               {/* High-Contrast Interactive Mockup */}
               <div className="rounded-[48px] shadow-[0_30px_60px_rgba(6,182,212,0.3)] border-4 border-white object-cover aspect-[4/3] relative z-10 bg-gradient-to-br from-blue-600 to-cyan-500 overflow-hidden flex items-center justify-center p-8">
                 
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>

                 {/* Connection SVG Line */}
                 <svg className="absolute inset-x-0 h-full w-full pointer-events-none z-10" style={{ filter: 'drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.3))' }}>
                   <path d="M 120,120 C 180,120 180,240 320,240" fill="none" stroke="white" strokeWidth="6" strokeDasharray="16 16" className="anim-dash" />
                 </svg>

                 {/* Floating UI Card 1 */}
                 <div className="absolute top-[15%] left-[10%] w-[55%] bg-white rounded-[32px] p-6 shadow-2xl border-2 border-white anim-float z-20 hover:scale-105 transition-transform">
                   <div className="flex items-center gap-5 mb-5">
                     <div className="w-16 h-16 rounded-[20px] bg-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-200">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-4 w-full bg-slate-200 rounded-full mb-3"></div>
                        <div className="h-3 w-2/3 bg-slate-100 rounded-full mb-1"></div>
                     </div>
                   </div>
                   <div className="h-10 w-32 rounded-full bg-cyan-50 border-2 border-cyan-200 flex items-center justify-center text-xs font-black text-cyan-700 tracking-widest uppercase shadow-sm">
                     New Job
                   </div>
                 </div>

                 {/* Floating UI Card 2 */}
                 <div className="absolute bottom-[10%] right-[10%] w-[60%] bg-slate-900 rounded-[32px] p-6 shadow-2xl border-2 border-slate-700 anim-float-delayed z-20 hover:scale-105 transition-transform">
                   <div className="flex items-center gap-5 mb-6">
                     <div className="relative shrink-0">
                       <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Professional" className="w-20 h-20 rounded-full object-cover border-[4px] border-slate-800 shadow-lg" />
                       <div className="absolute bottom-1 right-0 w-6 h-6 bg-emerald-400 border-[3px] border-slate-900 rounded-full shadow-md"></div>
                     </div>
                     <div className="flex-1">
                        <div className="h-4 w-full bg-white/20 rounded-full mb-3"></div>
                        <div className="flex items-center gap-1.5">
                          {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z"/></svg>)}
                        </div>
                     </div>
                   </div>
                   <div className="w-full bg-emerald-500 rounded-2xl py-4 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(16,185,129,0.3)] text-white text-sm font-black uppercase tracking-widest border border-emerald-400">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                     Instant Match
                   </div>
                 </div>

               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FINAL MASSIVE CTA --- */}
      <div className="max-w-5xl mx-auto px-4 mt-32 mb-32 relative z-10">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[64px] p-16 sm:p-24 text-center shadow-[0_40px_80px_rgba(59,130,246,0.4)] border-4 border-blue-400 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-400 rounded-full blur-[100px] opacity-40 group-hover:scale-125 transition-transform duration-1000 pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[100px] opacity-40 group-hover:scale-125 transition-transform duration-1000 pointer-events-none mix-blend-screen"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1] drop-shadow-lg">
              Ready to elevate your projects?
            </h2>
            <p className="text-2xl text-blue-100 font-bold max-w-3xl mx-auto mb-14 drop-shadow-md">
              Join thousands of businesses and professionals already using SkillServe to redefine modern work.
            </p>
            <Link to={user ? "/dashboard" : "?auth=register"} className="inline-flex items-center justify-center gap-4 px-14 py-7 bg-white text-blue-700 font-black rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:bg-slate-50 transition-all text-2xl uppercase tracking-widest border-2 border-slate-100">
              {user ? "Go to Workspace" : "Join the Network"}
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
