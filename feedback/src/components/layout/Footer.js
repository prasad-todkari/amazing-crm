import { useEffect, useState } from 'react';

export default function Footer({ darkMode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} FeedbackHub. All rights reserved.</span>
          <span className="hidden md:inline">|</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              isOnline
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            System Status: {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* <div className="flex items-center space-x-6 text-sm text-gray-500">
          <p className="hover:text-blue-600 transition-colors cursor-pointer">
            Privacy Policy
          </p>
          <p className="hover:text-blue-600 transition-colors cursor-pointer">
            Terms of Service
          </p>
          <p className="hover:text-blue-600 transition-colors cursor-pointer">
            Support
          </p>
          <div className="flex items-center space-x-2">
            <span>Version 2.1.4</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
