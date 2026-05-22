import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { User, Settings, Contrast, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// A profile menu that provides quick access to account settings and logout options.
const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggles the visibility of the profile dropdown menu.
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Executes the logout process and redirects the user to the login page.
  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 p-1 sm:p-1 border border-white/5 hover:border-white/10 transition-colors outline-none active:scale-95 duration-200 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
            />
          ) : (
            <span className="text-white font-black text-[10px] uppercase">
              {user.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none gap-1 pr-3">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {user.name}
          </span>
          <span className="text-[7px] text-primary font-black uppercase tracking-[0.2em]">
            {user.jobTitle || (user.role && user.role.replace('_', ' '))}
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-64 bg-black border border-white/15 rounded-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          style={{
            backgroundColor: 'var(--color-background-dark)',
            borderColor: 'var(--color-border-subtle)',
          }}
        >
          {/* Header */}
          <div
            className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <div className="w-10 h-10 rounded-none bg-black border border-white/10 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-none object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-none bg-white/5 flex items-center justify-center">
                  <span className="text-white text-base font-black uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col overflow-hidden gap-1">
              <h3
                className="text-[11px] font-black text-white uppercase truncate leading-none tracking-widest"
                style={{ color: 'var(--color-text)' }}
              >
                {user.name}
              </h3>
              <p
                className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em] truncate leading-none"
                style={{ color: 'var(--color-text-subtler)' }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-0.5">
            <DropdownItem
              icon={<User size={18} strokeWidth={2.2} />}
              label="Profile"
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
            />
            <DropdownItem
              icon={<Settings size={18} strokeWidth={2.2} />}
              label="Account settings"
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
            />
            <DropdownItem
              icon={<Contrast size={18} strokeWidth={2.2} />}
              label="Theme"
              onClick={() => {
                setIsOpen(false);
                navigate('/theme');
              }}
              trailing={
                <ChevronRight
                  size={16}
                  className="text-text-muted/40 group-hover:text-white/60 transition-colors"
                />
              }
            />
          </div>

          <div className="h-[1px] bg-white/5 mx-2 my-1" />

          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-none text-status-error/60 hover:bg-status-error/5 hover:text-status-error transition-colors group cursor-pointer"
            >
              <span className="p-1 rounded-none border border-status-error/20 bg-status-error/5 group-hover:border-status-error/40 transition-colors">
                <LogOut size={14} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                Log_Out
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// A reusable component for individual items within the profile dropdown.
const DropdownItem = ({ icon, label, trailing, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-2 rounded-none text-white/40 hover:text-white hover:bg-white/5 transition-colors group cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <span className="p-1 rounded-none bg-white/5 group-hover:bg-white/10 transition-colors">
        {React.cloneElement(icon, { size: 14 })}
      </span>
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    {trailing && React.cloneElement(trailing, { size: 12 })}
  </button>
);

DropdownItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  trailing: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default ProfileDropdown;
