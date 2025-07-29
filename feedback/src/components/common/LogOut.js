import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // or your login route
  };

  return (
    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
      Logout
    </button>
  );
};

export default LogoutButton;
