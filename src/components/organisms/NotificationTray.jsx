import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Rocket,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications';
import { formatTime } from '../../utils/formatTime';

// A modern notification management tray that provides a bird's eye view of mission-critical team updates.
const NotificationTray = () => {
  const [isOpen, setIsOpen] = useState(false);
  const trayRef = useRef(null);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    refresh,
  } = useNotifications();

  // Handle closing when clicking outside the component.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trayRef.current && !trayRef.current.contains(event.target))
        setIsOpen(false);
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
      case 'TASK_ASSIGNED':
        return <span className="text-sm">👤</span>;
      case 'TASK_UPDATED':
        return <Rocket size={14} className="text-secondary" />;
      case 'COMMENT_ADDED':
        return <MessageSquare size={14} className="text-status-warning" />;
      default:
        return <AlertCircle size={14} className="text-text-muted" />;
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
        className="relative p-2 rounded-none text-white/40 hover:text-white hover:bg-white/5 transition-colors group"
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-pulse' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-black text-[8px] font-black rounded-none flex items-center justify-center border border-black z-10">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Expanded Notifications Panel */}
      {isOpen && (
        <div
          className="absolute top-[calc(100%+4px)] right-0 w-80 sm:w-85 bg-black border border-white/15 rounded-none overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-50"
          style={{
            backgroundColor: 'var(--color-background-dark)',
            borderColor: 'var(--color-border-subtle)',
          }}
        >
          <div
            className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                Operational_Alerts
              </span>
              {unreadCount > 0 && (
                <div className="w-1.5 h-1.5 rounded-none bg-primary" />
              )}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[9px] font-black text-primary hover:brightness-125 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                >
                  Mark_Read
                  <CheckCircle2 size={10} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[9px] font-black text-white/20 hover:text-status-error transition-colors uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto no-scrollbar scroll-smooth">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-white/5 last:border-0 relative group hover:bg-white/[0.04] ${!notif.isRead ? 'bg-primary/5' : 'opacity-40'}`}
                >
                  {!notif.isRead && (
                    <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-primary rounded-none" />
                  )}

                  <div
                    className={`shrink-0 w-8 h-8 rounded-none flex items-center justify-center transition-colors ${!notif.isRead ? 'bg-primary/20 border border-primary/40 text-primary' : 'bg-white/5 border border-white/10 text-white/20'}`}
                  >
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4
                        className={`text-[10px] font-black tracking-widest uppercase truncate ${!notif.isRead ? 'text-white' : 'text-white/40'}`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[8px] font-black text-white/20 whitespace-nowrap ml-3 uppercase tracking-[0.2em]">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-[9px] leading-tight line-clamp-2 uppercase font-black tracking-widest ${!notif.isRead ? 'text-white/60' : 'text-white/20'}`}
                    >
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-4 opacity-10">
                <div className="w-10 h-10 bg-white/5 rounded-none flex items-center justify-center text-white border border-white/10">
                  <Rocket size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                    ALL_CLEAR
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em]">
                    MISSION_LOG_SYNCHRONIZED
                  </p>
                </div>
              </div>
            )}
          </div>

          <div
            className="p-3 bg-white/5 border-t border-white/10 text-center"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="text-[9px] font-black text-white/20 hover:text-white/60 transition-colors uppercase tracking-[0.3em]"
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
