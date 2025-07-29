import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../common/LogOut'
import { useRef, useEffect } from 'react';


export default function Navbar({ userName, userRole, onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);


  const notifications = [
    // { id: 1, message: 'New feedback submitted', time: '2 mins ago', unread: true },
    // { id: 2, message: 'User  role updated', time: '1 hour ago', unread: true },
    // { id: 3, message: 'System maintenance scheduled', time: '3 hours ago', unread: false },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button onClick={onMenuClick} className="p-2 rounded-md hover:bg-gray-100">
            <i className="ri-menu-line text-xl text-gray-700"></i>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-slate-600 rounded-md flex items-center justify-center">
              <i className="ri-feedback-line text-white text-base"></i>
            </div>
            <span className="text-lg font-semibold text-gray-800">FeedbackHub</span>
          </div>

          {/* <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap">
              Dashboard
            </Link>
            <Link to="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap">
              Feedback
            </Link>
            {(userRole === 'admin' || userRole === 'moderator') && (
              <Link to="/users" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                Users
              </Link>
            )}
            {userRole === 'admin' && (
              <Link to="/settings" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                Settings
              </Link>
            )}
          </div> */}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-gray-600 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <i className="ri-notification-3-line text-xl"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-slate-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              <i className="ri-arrow-down-s-line text-gray-600"></i>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Profile Settings
                </Link>
                <Link to="/preferences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Preferences
                </Link>
                <hr className="my-2" />
                <LogOutButton />
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
