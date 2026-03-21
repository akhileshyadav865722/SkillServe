import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Protect Admin Route
  useEffect(() => {
    if (!user) {
      navigate('/?auth=admin');
    } else if (user.role !== 'admin') {
      navigate('/dashboard'); 
    }
  }, [user, navigate]);

  // Fetch Data
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        if (activeTab === 'overview') {
          const res = await axios.get('/admin/stats');
          setStats(res.data);
        } else if (activeTab === 'users') {
          const res = await axios.get('/admin/users');
          setUsersList(res.data);
        } else if (activeTab === 'requests') {
          const res = await axios.get('/admin/requests');
          setRequestsList(res.data);
        }
      } catch (error) {
        setErrorMsg('SECURE UPLINK FAILED. ' + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("CRITICAL WARNING: Terminate User Profile and ALL associated requests globally? This is irreversible.")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsersList(usersList.filter(u => u._id !== id));
    } catch (error) {
      alert("Termination Error: " + (error.response?.data?.message || 'Server failure'));
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Force deletion of this service request?")) return;
    try {
      await axios.delete(`/admin/requests/${id}`);
      setRequestsList(requestsList.filter(r => r._id !== id));
    } catch (error) {
      alert("Override Error: " + (error.response?.data?.message || 'Server failure'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-[#020202] text-slate-300 font-sans overflow-hidden select-none relative group">
      
      {/* OBSIDIAN CYBERPUNK BACKGROUND ASSETS */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen animate-pulse duration-10000"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      {/* Dashing Animated Grid Container */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none perspective-[1000px]">
        {/* The Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.3)_1px,transparent_1px)] bg-[size:50px_50px] [transform:rotateX(60deg)_translateZ(-200px)_scale(2)] origin-top"></div>
        {/* Animated Scanning Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] opacity-30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
      </div>

      {/* ADMIN SIDEBAR */}
      <aside className="w-[300px] bg-black/60 backdrop-blur-2xl border-r border-[#1a1a1a] flex flex-col z-20 shadow-[30px_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Sidebar Highlight Edge */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
        
        {/* Sidebar Header */}
        <div className="h-28 flex items-center px-10 border-b border-[#1a1a1a] bg-gradient-to-br from-[#0c0c0c] to-[#040404] relative group cursor-default">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-[#050505] border-2 border-cyan-500/30 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-500 transform group-hover:rotate-12">
              <svg className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-black tracking-[0.2em] text-lg group-hover:text-cyan-300 transition-colors uppercase drop-shadow-md">
                SYS_CORE
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></span>
                <p className="text-[10px] text-emerald-400/80 font-mono tracking-widest uppercase mt-0.5">Link Established</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Matrix */}
        <nav className="flex-1 px-5 py-10 space-y-3 relative z-10">
          <div className="text-[10px] text-slate-500 font-mono tracking-[0.3em] uppercase mb-6 px-4 flex items-center gap-2 opacity-60">
            <div className="flex-1 h-[1px] bg-slate-800"></div>
            Modules
            <div className="flex-1 h-[1px] bg-slate-800"></div>
          </div>
          
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-lg overflow-hidden relative group
              ${activeTab === 'overview' 
                ? 'bg-[#0a0f14] text-cyan-300 border border-cyan-500/30' 
                : 'bg-transparent text-slate-500 hover:text-slate-200 border border-transparent hover:border-slate-800 hover:bg-[#0a0a0a]'}`}
          >
            {activeTab === 'overview' && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent pointer-events-none"></div>
            )}
            <svg className={`w-5 h-5 ${activeTab === 'overview' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Omni Matrix
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-lg overflow-hidden relative group
              ${activeTab === 'users' 
                ? 'bg-[#06100c] text-emerald-300 border border-emerald-500/30' 
                : 'bg-transparent text-slate-500 hover:text-slate-200 border border-transparent hover:border-slate-800 hover:bg-[#0a0a0a]'}`}
          >
            {activeTab === 'users' && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent pointer-events-none"></div>
            )}
            <svg className={`w-5 h-5 ${activeTab === 'users' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Surveillance
          </button>

          <button 
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-lg overflow-hidden relative group
              ${activeTab === 'requests' 
                ? 'bg-[#0e0814] text-purple-300 border border-purple-500/30' 
                : 'bg-transparent text-slate-500 hover:text-slate-200 border border-transparent hover:border-slate-800 hover:bg-[#0a0a0a]'}`}
          >
            {activeTab === 'requests' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent pointer-events-none"></div>
            )}
            <svg className={`w-5 h-5 ${activeTab === 'requests' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Global Ledgers
          </button>
        </nav>

        {/* Footer Identity */}
        <div className="p-8 border-t border-[#1a1a1a] bg-gradient-to-t from-[#020202] to-[#080808] z-10 relative">
          <div className="flex flex-col mb-6">
            <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mb-1">Authenticated ID</span>
            <span className="text-white text-sm font-black tracking-widest uppercase truncate">{user.name}</span>
            <span className="text-[9px] text-cyan-500/80 font-mono tracking-[0.2em] uppercase mt-2 bg-cyan-950/30 border border-cyan-900/50 py-1 px-2 rounded-sm inline-block w-fit">Clearance: OMEGA</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full relative group overflow-hidden rounded-lg bg-[#0a0a0a] border border-[#222]"
          >
            <div className="absolute inset-0 bg-red-600 top-full group-hover:top-0 transition-all duration-500 ease-out z-0"></div>
            <div className="relative z-10 flex items-center justify-center gap-3 py-3.5 px-4 text-slate-400 group-hover:text-white transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sever Uplink</span>
            </div>
          </button>
        </div>
      </aside>

      {/* CORE CONTENT MATRIX */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto z-20 p-8 sm:p-14 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent relative">
        
        {/* Decorative Grid Lines overlaying content */}
        <div className="fixed top-0 bottom-0 left-[300px] right-0 pointer-events-none z-[100] border-t-2 border-b-2 border-cyan-500/5 opacity-10"></div>
        <div className="fixed top-0 bottom-0 left-[350px] w-[1px] bg-cyan-500/10 z-[100] pointer-events-none mix-blend-screen shadow-[0_0_10px_#22d3ee]"></div>

        {/* Error Fallback */}
        {errorMsg && (
          <div className="w-full bg-[#0a0505] border-l-4 border-red-500 p-8 flex items-start gap-6 mb-10 shadow-[0_10px_40px_rgba(239,68,68,0.15)] relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,68,68,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
            <div className="w-12 h-12 rounded-full bg-red-950/50 flex items-center justify-center border border-red-500/30 flex-shrink-0 relative z-10">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-red-500 font-black tracking-[0.2em] uppercase text-lg mb-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">System Compromise Detected</h3>
              <p className="text-red-400/80 text-xs font-mono tracking-widest leading-relaxed uppercase">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && !errorMsg && (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center opacity-80 backdrop-blur-md">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#111] border-t-cyan-400 rounded-full animate-spin duration-700 shadow-[0_0_30px_rgba(34,211,238,0.2)]"></div>
              <div className="absolute inset-4 border-4 border-[#111] border-b-emerald-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_20px_rgba(52,211,153,0.2)]"></div>
              <div className="absolute inset-8 border-4 border-[#111] border-l-purple-400 rounded-full animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(192,132,252,0.2)]"></div>
            </div>
            <p className="mt-10 text-cyan-400 font-mono tracking-[0.4em] uppercase text-xs animate-pulse font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Decrypting Mainframe...</p>
          </div>
        )}

        {/* --- VIEW: OVERVIEW MATRIX --- */}
        {!isLoading && !errorMsg && activeTab === 'overview' && stats && (
          <div className="animate-fade-in-up relative z-10 w-full max-w-7xl mx-auto">
            {/* Header section */}
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222] pb-8 relative">
              <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee]"></div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-md">Omni <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Matrix</span></h2>
                </div>
                <p className="text-slate-400 text-xs font-mono tracking-[0.3em] uppercase ml-6">Global Neural Feed Processing Active</p>
              </div>
              <div className="flex items-center gap-4 bg-[#0a0a0a] border border-[#222] rounded-lg px-6 py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase">Status</span>
                  <span className="text-emerald-400 font-black tracking-widest text-xs drop-shadow-[0_0_5px_#34d399]">OPTIMAL</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-950/20">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
                </div>
              </div>
            </div>
            
            {/* Holographic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stat Pillar 1 */}
              <div className="bg-gradient-to-b from-[#0a0f12] to-[#040608] border border-[#1a2530] rounded-xl p-8 relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)] transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_#22d3ee]"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[40px] group-hover:bg-cyan-400/20 transition-colors duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 border-b border-[#1a2530] pb-6 relative z-10">
                  <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-900/50">
                    <svg className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-cyan-400/60 font-mono text-[9px] uppercase tracking-[0.2em] border border-cyan-900/40 px-2 py-1 rounded">Live Data</span>
                </div>
                
                <p className="text-slate-400 text-[11px] uppercase tracking-[0.3em] font-black mb-1 relative z-10 mt-4">Total Registered</p>
                <h3 className="text-cyan-50 text-xs font-mono tracking-widest opacity-60 mb-3 uppercase">Entities</h3>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter relative z-10 group-hover:scale-105 transform origin-left transition-transform duration-500">
                  {stats.totalUsers}
                </div>
              </div>

              {/* Stat Pillar 2 */}
              <div className="bg-gradient-to-b from-[#06100c] to-[#020604] border border-[#142920] rounded-xl p-8 relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_#34d399]"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-400/20 transition-colors duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 border-b border-[#142920] pb-6 relative z-10">
                  <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-900/50">
                    <svg className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_5px_#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <span className="text-emerald-400/60 font-mono text-[9px] uppercase tracking-[0.2em] border border-emerald-900/40 px-2 py-1 rounded">Secured</span>
                </div>
                
                <p className="text-slate-400 text-[11px] uppercase tracking-[0.3em] font-black mb-1 relative z-10 mt-4">Active Platform</p>
                <h3 className="text-emerald-50 text-xs font-mono tracking-widest opacity-60 mb-3 uppercase">Contracts</h3>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter relative z-10 group-hover:scale-105 transform origin-left transition-transform duration-500">
                  {stats.totalRequests}
                </div>
              </div>

              {/* Stat Breakdown Pillar */}
              <div className="bg-[#050505] border border-[#222] rounded-xl relative overflow-hidden p-1 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Cyberpunk rotating border effect */}
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(34,211,238,0.8)_360deg)] animate-[spin_4s_linear_infinite] opacity-50"></div>
                <div className="absolute inset-[2px] bg-gradient-to-br from-[#0c0c0c] to-[#040404] rounded-lg z-10 p-7 flex flex-col justify-between">
                  <h3 className="text-white text-sm font-black tracking-[0.2em] uppercase border-b border-[#222] pb-5 mb-5 flex items-center justify-between">
                    Sector Division
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </h3>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div className="flex justify-between items-end group">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-mono block mb-1">Standard Users</span>
                        <span className="text-cyan-400 text-sm font-black uppercase tracking-widest drop-shadow-[0_0_5px_#22d3ee]">Client Tier</span>
                      </div>
                      <span className="text-4xl font-black text-white group-hover:text-cyan-50 transition-colors drop-shadow-md">{stats.clients}</span>
                    </div>
                    
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
                    
                    <div className="flex justify-between items-end group">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-mono block mb-1">Service Providers</span>
                        <span className="text-emerald-400 text-sm font-black uppercase tracking-widest drop-shadow-[0_0_5px_#34d399]">Pro Tier</span>
                      </div>
                      <span className="text-4xl font-black text-white group-hover:text-emerald-50 transition-colors drop-shadow-md">{stats.professionals}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Massive Empty Graphic for Matrix aesthetic */}
            <div className="mt-14 w-full h-72 border border-[#1a1a1a] bg-gradient-to-b from-[#0a0a0a]/80 to-[#020202] rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
               
               {/* Radar Sweeper */}
               <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-cyan-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-cyan-500/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-cyan-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 border-dashed"></div>
               <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]"></div>

               {/* Random Data Points */}
               <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] animate-ping"></div>
               <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc] animate-ping" style={{animationDelay: '1s'}}></div>
               <div className="absolute top-[45%] left-[25%] w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_10px_#fb7185] animate-ping" style={{animationDelay: '2s'}}></div>

               <div className="relative z-10 flex flex-col items-center bg-[#050505]/80 px-8 py-6 rounded-2xl border border-[#222] backdrop-blur-xl">
                 <div className="w-16 h-1 bg-cyan-500 mb-6 shadow-[0_0_15px_#22d3ee]"></div>
                 <p className="text-white font-black text-2xl tracking-[0.5em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center pl-2">Global Live Sensors</p>
                 <p className="text-cyan-400 font-mono text-[10px] tracking-[0.4em] uppercase mt-3">Monitoring 12,408 Nodes...</p>
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW: ENTITY SURVEILLANCE --- */}
        {!isLoading && !errorMsg && activeTab === 'users' && (
          <div className="animate-fade-in-up relative z-10 w-full max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 relative">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/50 via-[#222] to-transparent"></div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-emerald-400 shadow-[0_0_10px_#34d399]"></div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-md">Entity <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Surveillance</span></h2>
                </div>
                <p className="text-slate-400 text-xs font-mono tracking-[0.3em] uppercase ml-6">Tracking {usersList.length} Active Profiles</p>
              </div>
            </div>

            <div className="w-full bg-[#030504]/90 backdrop-blur-2xl border border-emerald-900/30 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-500 to-transparent opacity-80 shadow-[0_0_15px_#34d399]"></div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#060c09] border-b border-emerald-900/40">
                      <th className="px-8 py-6 text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] font-black">ID Signature</th>
                      <th className="px-8 py-6 text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] font-black">Designation / Alias</th>
                      <th className="px-8 py-6 text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] font-black">Clearance Sector</th>
                      <th className="px-8 py-6 text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] font-black">Initiation Block</th>
                      <th className="px-8 py-6 text-[10px] font-mono text-rose-500 uppercase tracking-[0.2em] font-black w-32 border-l border-[#1a1a1a] text-center bg-rose-950/10">Execute</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a2520]">
                    {usersList.length === 0 ? (
                      <tr><td colSpan="5" className="p-12 text-center text-emerald-600/50 font-mono tracking-[0.3em] uppercase text-sm font-black">No Entities Detected In Sector.</td></tr>
                    ) : (
                      usersList.map((usr) => (
                        <tr key={usr._id} className="hover:bg-emerald-950/20 transition-all duration-300 group">
                          <td className="px-8 py-5 text-xs font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                            {usr._id.substring(0, 8)}...<span className="opacity-40">{usr._id.substring(18)}</span>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-black text-white mb-1 group-hover:translate-x-1 transition-transform">{usr.name}</p>
                            <p className="text-[10px] font-mono text-slate-500 tracking-widest">{usr.email}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em] rounded mix-blend-screen shadow-sm
                              ${usr.role === 'client' ? 'text-cyan-400 border-cyan-800 bg-cyan-950/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-emerald-400 border-emerald-800 bg-emerald-950/50 shadow-[0_0_10px_rgba(52,211,153,0.2)]'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${usr.role === 'client' ? 'bg-cyan-400 shrink-0' : 'bg-emerald-400 shrink-0'}`}></span>
                              {usr.role === 'client' ? 'Standard' : 'Professional'}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-[11px] font-mono text-slate-400 tracking-widest uppercase">
                            {new Date(usr.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                          </td>
                          <td className="px-0 py-0 border-l border-[#1a1a1a] w-32 group hover:bg-rose-950/30 transition-colors h-full">
                            <button 
                              onClick={() => handleDeleteUser(usr._id)}
                              className="w-full h-full min-h-[70px] flex items-center justify-center text-slate-600 hover:text-rose-500 transition-all focus:outline-none"
                              title="CRITICAL: Terminate Entity"
                            >
                              <div className="p-3 border border-transparent rounded-full hover:border-rose-500/40 hover:bg-rose-950/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </div>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: GLOBAL LEDGERS --- */}
        {!isLoading && !errorMsg && activeTab === 'requests' && (
          <div className="animate-fade-in-up relative z-10 w-full max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 relative">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-500/50 via-[#222] to-transparent"></div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-purple-400 shadow-[0_0_10px_#c084fc]"></div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-md">Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Ledgers</span></h2>
                </div>
                <p className="text-slate-400 text-xs font-mono tracking-[0.3em] uppercase ml-6">Contracts Detected: {requestsList.length}</p>
              </div>
              <div className="bg-[#050505] border border-purple-900/50 rounded px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(192,132,252,0.15)]">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-mono text-purple-400 tracking-[0.2em] uppercase">Live Sync Active</span>
              </div>
            </div>

            <div className="grid gap-6 w-full">
              {requestsList.length === 0 ? (
                <div className="w-full p-16 border border-[#222] bg-[#07050a]/80 backdrop-blur-xl rounded-xl flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  <svg className="w-12 h-12 text-slate-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-purple-600/50 font-black tracking-[0.4em] uppercase text-sm">No Contracts Found In System.</p>
                </div>
              ) : (
                requestsList.map((req) => (
                  <div key={req._id} className="bg-gradient-to-r from-[#0a0510] to-[#040206] backdrop-blur-xl border border-purple-900/30 rounded-xl hover:border-purple-500/60 transition-all duration-300 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between group shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(192,132,252,0.15)] relative overflow-hidden">
                    {/* Hover Glow effect */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[80px] group-hover:bg-purple-500/10 -translate-y-1/2 translate-x-1/2 transition-colors duration-700 pointer-events-none"></div>
                    
                    <div className="flex items-start gap-6 flex-1 relative z-10 w-full sm:w-auto">
                      <div className="w-12 h-12 shrink-0 bg-[#050505] border border-purple-500/30 rounded-lg flex items-center justify-center group-hover:border-purple-400 transition-colors shadow-[0_0_15px_rgba(192,132,252,0.1)]">
                        <svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_5px_#c084fc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 w-full">
                        <h4 className="text-white text-xl font-black mb-3 group-hover:text-purple-300 transition-colors uppercase tracking-tight truncate drop-shadow-md">{req.title}</h4>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full bg-[#030105] border border-[#222] rounded-md p-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em] uppercase mb-1">Creator Origin</span>
                            <span className="text-slate-300 text-xs font-bold uppercase truncate">{req.createdBy?.name || 'TERMINATED ENTITY'}</span>
                          </div>
                          <div className="flex flex-col border-l border-[#222] pl-4">
                            <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em] uppercase mb-1">Network Status</span>
                            <span className="text-purple-400 text-xs font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]">{req.status}</span>
                          </div>
                          <div className="flex flex-col border-l border-[#222] pl-4">
                            <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em] uppercase mb-1">Budget Allocation</span>
                            <span className="text-emerald-400 text-xs font-black uppercase font-sans drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">${req.budget}</span>
                          </div>
                          <div className="flex flex-col border-l border-[#222] pl-4">
                            <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em] uppercase mb-1">Log ID</span>
                            <span className="text-slate-500 text-[10px] font-mono truncate">{req._id.substring(16)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 sm:mt-0 sm:ml-8 relative z-10 w-full sm:w-auto flex justify-end">
                      <button 
                        onClick={() => handleDeleteRequest(req._id)}
                        className="w-full sm:w-auto px-6 py-4 bg-transparent text-rose-500 font-black text-[11px] uppercase tracking-[0.2em] border border-rose-900/40 hover:border-rose-500 hover:bg-rose-950/60 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] rounded-lg flex items-center justify-center gap-2 group/btn relative overflow-hidden focus:outline-none"
                      >
                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0"></div>
                        <svg className="w-4 h-4 relative z-10 group-hover/btn:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="relative z-10">Purge Contract</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;
