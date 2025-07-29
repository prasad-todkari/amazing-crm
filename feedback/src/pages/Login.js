import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/loginServices';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser({ username, password });
      login(res.token, res.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-200 px-2 pt-10">
      <div className="flex flex-col items-center w-full">
        <img src="https://i.ibb.co/Rk9S2sSM/alogo.png" alt="afoozo" className="w-40 mb-6 mt-2" />
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
          <h2 className="font-serif text-2xl font-semibold mb-8 text-center text-gray-800">Login</h2>

          {error && (
            <div className="text-red-600 mb-4 text-sm text-center">{error}</div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2 mb-5 focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-600 text-white py-2 rounded hover:bg-slate-700 transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
