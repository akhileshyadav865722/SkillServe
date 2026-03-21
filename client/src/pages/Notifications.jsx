import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead, clearNotifications } from '../store/notificationSlice';

function Notifications() {
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const dispatch = useDispatch();

  useEffect(() => {
    // Automatically mark all as read after 3 seconds of viewing the page
    const timer = setTimeout(() => {
      if (notifications.length > 0) {
        dispatch(markAllAsRead());
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch, notifications.length]);

  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24 relative overflow-x-hidden overflow-y-auto isolate pt-32">
      {/* 
        Light Aurora Global Background Decor 
        Replacing warm colors with stunning oceanic blue/cyan glowing blobs
      */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none -z-10 fixed animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-[20%] left-[-15%] w-[800px] h-[800px] bg-cyan-300/20 rounded-full blur-[140px] pointer-events-none -z-10 fixed animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10 fixed"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Superior Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 bg-white/40 backdrop-blur-md p-8 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-200/50 backdrop-blur-md mb-4 shadow-sm">
              Account Sync
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2 drop-shadow-sm">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">Alerts</span>
            </h1>
            <p className="text-slate-600 font-bold text-lg max-w-md">
              Stay updated with your latest bookings, messages, and platform updates.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {notifications.length > 0 && (
              <button 
                onClick={() => dispatch(clearNotifications())}
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 hover:text-rose-600 hover:border-rose-200 transition-all duration-300 flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Inbox
              </button>
            )}
          </div>
        </div>

        {/* Breathtaking Glassy Notifications List */}
        <div className="space-y-5">
          {notifications.length === 0 ? (
            <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-2xl rounded-[32px] border border-white p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white">
                <svg className="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-3">You're all caught up!</h3>
              <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto">You have no new notifications right now. Enjoy the silence.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`group relative backdrop-blur-2xl rounded-[24px] p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(37,99,235,0.12)] hover:-translate-y-1 border-2 overflow-hidden
                  ${notification.read 
                    ? 'bg-white/40 border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]' 
                    : 'bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border-white hover:border-blue-300 shadow-[0_8px_30px_rgba(37,99,235,0.08)] ring-1 ring-blue-900/5'}`}
              >
                
                {/* Left Accent Bar for Unread */}
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400 opacity-80"></div>
                )}

                {/* Pulsing Cyan Orb for Unread */}
                {!notification.read && (
                  <div className="absolute top-8 right-8 w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)] border-2 border-white"></div>
                )}
                
                <div className="flex gap-5 sm:gap-6 items-start">
                  
                  {/* Dynamic Beautiful Icons */}
                  <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0 shadow-inner border border-white/50
                    ${notification.type === 'success' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-500' : 
                      notification.type === 'info' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600' : 
                      'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500'}`}
                  >
                    {notification.type === 'success' ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 pr-10">
                    <h4 className={`text-xl mb-2 tracking-tight ${notification.read ? 'font-black text-slate-700' : 'font-black text-slate-900 group-hover:text-blue-800 transition-colors'}`}>
                      {notification.title}
                    </h4>
                    
                    <div className="bg-white/50 rounded-xl p-3 border-l-2 border-blue-200 shadow-sm mb-3">
                      <p className={`text-base leading-relaxed ${notification.read ? 'text-slate-500 font-bold' : 'text-slate-700 font-bold'}`}>
                        {notification.message}
                      </p>
                    </div>

                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {notification.timestamp && !isNaN(new Date(notification.timestamp).getTime())
                        ? new Date(notification.timestamp).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })
                        : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
