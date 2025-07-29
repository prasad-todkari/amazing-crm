import { useEffect, useState } from 'react';
import { ToastSuccess } from '../../components/common/Toast';
import UserModal from '../../components/master/UserModal';
import { getAllUsers, addNewUser, editUser } from '../../services/masterServices';
import { getAllSites } from '../../services/siteServices'
import { formatDate } from '../../components/common/DateFormat';

export default function UserMaster() {
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [userResponse, siteResponse] = await Promise.all([
          getAllUsers(),
          getAllSites()
        ]);
        console.log('Fetched users:', userResponse.data);
        console.log('Fetched sites:', siteResponse.data);
        setUsers(userResponse.data);
        setSites(siteResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [refresh]);

  const [modal, setModal] = useState({ open: false, mode: 'add', user: null });
  const [formUser, setFormUser] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    is_active: true,
    site_ids: []
  });
  const [toastMessage, setToastMessage] = useState('');

  const openAddModal = () => {
    setFormUser({ name: '', role: '', email: '', password: '', is_active: true, site_ids: [] });
    setModal({ open: true, mode: 'add', user: null });
  };

  const openEditModal = (user) => {
    setFormUser({
      id: user.users_id,
      name: user.name,
      role: user.role,
      email: user.email,
      is_active: user.is_active,
      site_ids: user.site_ids || []
    });
    setModal({ open: true, mode: 'edit', user });
  };

  const handleSave = async () => {
    setLoading(true);
    if (!formUser.name.trim()) return;

    try {
      if (modal.mode === 'add') {
        const addedUser = await addNewUser(formUser);
        console.log('New user added:', addedUser);
        setToastMessage('User added successfully!');
      } else {
        const updatedUser = await editUser(formUser);
        console.log('Editing user:', updatedUser);
        setToastMessage('User updated successfully!');
      }

      setModal({ open: false, mode: 'add', user: null });
      setFormUser({ name: '', role: '', email: '', password: '', is_active: true, site_ids: [] });
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error saving user:', error);
      setToastMessage('Error saving user.');
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    setToastMessage('User deleted.');
  };

  return (
    <div className="p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">User Master</h2>
        <button
          onClick={openAddModal}
          className="bg-slate-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      <table className="w-full text-sm shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Role</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Created</th>
            <th className="px-3 py-2 text-left">Sites</th> {/* New column */}
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{user.name}</td>
              <td className="px-3 py-2 capitalize">{user.role}</td>
              <td className="px-3 py-2">
                <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                  {user.email}
                </a>
              </td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-3 py-2">
                {formatDate(user.createdon)}
              </td>
              <td className="px-3 py-2 relative group">
                <div
                  className="truncate max-w-xs text-gray-700 text-sm font-medium"
                >
                  {user.site_ids && user.site_ids.length > 0
                    ? `${sites.filter(site => user.site_ids.includes(site.site_id)).length} site${sites.filter(site => user.site_ids.includes(site.site_id)).length > 1 ? 's' : ''}`
                    : 'No sites assigned'}
                </div>
                {user.site_ids && user.site_ids.length > 0 && (
                  <div className="absolute left-0 mt-1 w-64 bg-gray-800 text-white text-sm rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    {sites
                      .filter(site => user.site_ids.includes(site.site_id))
                      .map(site => site.site_name)
                      .join(', ')}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 space-x-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal.open && (
        <UserModal
          open={modal.open}
          mode={modal.mode}
          formUser={formUser}
          setFormUser={setFormUser}
          onSave={handleSave}
          onClose={() => setModal({ open: false, mode: 'add', user: null })}
          loading={loading}
          sites={sites} // Pass sites to modal
        />
      )}

      {toastMessage && (
        <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
}