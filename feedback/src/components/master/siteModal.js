// components/modals/SiteModal.js
export default function SiteModal({ open, mode, formSite, setFormSite, categoryList, onClose, onSave, loading }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30" role="dialog" aria-labelledby="site-modal-title">
      <div className="bg-white p-6 rounded shadow-lg w-[400px] space-y-4">
        <h3 id="site-modal-title" className="text-lg font-semibold text-gray-800">
          {mode === 'add' ? 'Add New Site' : 'Edit Site'}
        </h3>

        <input
          type="text"
          placeholder="Site Name"
          className="border p-2 w-full rounded text-sm"
          value={formSite.name}
          onChange={(e) => setFormSite({ ...formSite, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Name"
          className="border p-2 w-full rounded text-sm"
          value={formSite.contactName}
          onChange={(e) => setFormSite({ ...formSite, contactName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact No"
          className="border p-2 w-full rounded text-sm"
          value={formSite.contactNo}
          onChange={(e) => setFormSite({ ...formSite, contactNo: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded text-sm"
          value={formSite.email}
          onChange={(e) => setFormSite({ ...formSite, email: e.target.value })}
        />
        <select
          className="border p-2 w-full rounded text-sm"
          value={formSite.category}
          onChange={(e) => setFormSite({ ...formSite, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categoryList && categoryList.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Address"
          className="border p-2 w-full rounded text-sm"
          value={formSite.address}
          onChange={(e) => setFormSite({ ...formSite, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          className="border p-2 w-full rounded text-sm"
          value={formSite.city}
          onChange={(e) => setFormSite({ ...formSite, city: e.target.value })}
        />
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={formSite.isActive}
            onChange={(e) => setFormSite({ ...formSite, isActive: e.target.checked })}
          />
          <span>Is Active</span>
        </label>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="text-sm px-3 py-1 rounded bg-slate-600 text-white hover:bg-slate-700"
            disabled={loading}
          >
            {mode === 'add' ? 'Save' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
