import Select from 'react-select';

export default function UserModal({ open, formUser, setFormUser, onClose, onSave, mode = 'add', loading, sites }) {
  const userRole = ['admin', 'manager', 'moderator', 'staff'];

  // Format sites for react-select
  const siteOptions = sites.map((site) => ({
    value: site.site_id,
    label: site.site_name
  }));

  // Pre-selected sites based on formUser.site_ids
  const selectedSites = siteOptions.filter((option) => formUser.site_ids.includes(option.value));

  // Handle site selection change
  const handleSiteChange = (selectedOptions) => {
    const site_ids = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormUser({ ...formUser, site_ids });
  };

  // Custom styles for react-select to match Tailwind CSS
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      padding: '0.25rem',
      backgroundColor: '#f9fafb',
      '&:hover': {
        borderColor: '#cbd5e1'
      },
      boxShadow: 'none'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e2e8f0',
      borderRadius: '0.25rem'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1f2937'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#dc2626',
        color: '#ffffff'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#ffffff',
      borderRadius: '0.375rem',
      border: '1px solid #e2e8f0'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#1e40af' : state.isFocused ? '#f1f5f9' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#1f2937',
      '&:hover': {
        backgroundColor: '#f1f5f9'
      }
    })
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30" role="dialog" aria-labelledby="user-modal-title">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto space-y-4">
        <h3 id="user-modal-title" className="text-lg font-semibold text-gray-800">
          {mode === 'add' ? 'Add New User' : 'Edit User'}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700">User Name</label>
          <input
            type="text"
            placeholder="User Name"
            className="mt-1 border p-2 w-full rounded text-sm focus:ring focus:ring-blue-200"
            value={formUser.name}
            onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 border p-2 w-full rounded text-sm focus:ring focus:ring-blue-200"
            value={formUser.role}
            onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
          >
            <option value="">Select Role</option>
            {userRole.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="mt-1 border p-2 w-full rounded text-sm focus:ring focus:ring-blue-200"
            value={formUser.email}
            onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
          />
        </div>

        {mode === 'add' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="mt-1 border p-2 w-full rounded text-sm focus:ring focus:ring-blue-200"
              value={formUser.password}
              onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Assign Sites</label>
          <Select
            isMulti
            options={siteOptions}
            value={selectedSites}
            onChange={handleSiteChange}
            placeholder="Select sites..."
            className="mt-1"
            styles={customStyles}
            isClearable
            isSearchable
          />
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={formUser.is_active}
            onChange={(e) => setFormUser({ ...formUser, is_active: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-200"
          />
          <span>Is Active</span>
        </label>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded border hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className={`text-sm px-4 py-2 rounded text-white transition ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Saving...' : mode === 'add' ? 'Save' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}