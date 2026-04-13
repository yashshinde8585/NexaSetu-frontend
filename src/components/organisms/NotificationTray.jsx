import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications';
import { formatTime } from '../../utils/formatTime';

// A modern notification management tray that provides a bird's eye view of mission-critical team updates.
const NotificationTray = () => {
  const [isOpen, setIsOpen] = useState(false);
  const trayRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, refresh } = useNotifications();

  // Handle closing when clicking outside the component.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trayRef.current && !trayRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) await markAsRead(notif._id);
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED': return <span className="text-sm">👤</span>;
      case 'TASK_UPDATED': return <Rocket size={14} className="text-secondary" />;
      case 'COMMENT_ADDED': return <MessageSquare size={14} className="text-status-warning" />;
      default: return <AlertCircle size={14} className="text-text-muted" />;
    }
  };

  return (
    <div className="relative h-full flex items-center" ref={trayRef}>
      {/* Trigger Button with Dynamic unread badge counts */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) refresh();
        }}
        className="relative p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all group"
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A0F] shadow-lg shadow-primary/40 animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Expanded Notifications Panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-80 sm:w-96 bg-black border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
          <div className="p-5 border-b border-white/15 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">Operational Alerts</span>
              {unreadCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 group"
                >
                  Mark Read
                  <CheckCircle2 size={12} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[10px] font-black text-white/40 hover:text-status-error/80 transition-colors uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto no-scrollbar scroll-smooth">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-6 flex gap-4 cursor-pointer transition-all border-b border-white/[0.02] last:border-0 relative group hover:bg-white/[0.04] ${!notif.isRead ? 'bg-primary/[0.04]' : 'opacity-50'}`}
                >
                  {!notif.isRead && (
                    <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-primary rounded-r-full shadow-lg shadow-primary/40" />
                  )}
                  
                  <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 ${!notif.isRead ? 'bg-primary/20 border border-primary/40' : 'bg-white/5 border border-white/15'}`}>
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-[12px] font-black tracking-widest uppercase truncate ${!notif.isRead ? 'text-white' : 'text-white/50'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[9px] font-black text-white/40 whitespace-nowrap ml-3 uppercase tracking-widest">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 uppercase font-bold tracking-wider ${!notif.isRead ? 'text-white/70' : 'text-white/40'}`}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center flex flex-col items-center justify-center space-y-5 opacity-30">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-text-muted border border-white/5">
                    <Rocket size={24} />
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] font-bold text-white">All Clear</p>
                    <p className="text-[10px] font-medium tracking-tight">Your mission log is completely synchronized</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white/5 border-t border-white/15 text-center">
             <button
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-white/40 hover:text-white/80 transition-colors uppercase tracking-[0.2em]"
             >
                Close Monitoring Panel
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTray;
