import { useState, useEffect } from 'react';
import { addSite, editSite, getAllSites } from '../../services/siteServices';
import { getAllCategories } from '../../services/masterServices';
import { ToastSuccess, ToastError } from '../../components/common/Toast';
import SiteModal from '../../components/master/siteModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import useFilteredSites from '../../components/SiteMaster/useFilteredSites';
import SearchFilterBar from '../../components/SiteMaster/SearchFilterBar';
import PaginationControls from '../../components/SiteMaster/PaginationControls';

export default function SiteMaster() {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', site: null });
  const [formSite, setFormSite] = useState({
    name: '', isActive: true, contactName: '', contactNo: '', category: '',
    email: '', address: '', city: ''
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [message, setMessage] = useState('');
  const [siteId, setSiteId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { filteredSites, paginatedSites, totalPages } = useFilteredSites(
    sites, searchTerm, filterCity, filterCategory, currentPage, itemsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
    const [siteRes, catRes] = await Promise.all([getAllSites(), getAllCategories()]);
      setSites(siteRes.data);
      setCategories(catRes.data);
      setLoading(false);
    };
    fetchData();
  }, [refresh]);

  const openAddModal = () => {
    setFormSite({ name: '', isActive: true, contactName: '', contactNo: '', category: '', email: '', address: '', city: '' });
    setModal({ open: true, mode: 'add', site: null });
  };

  const openEditModal = (site) => {
    setFormSite({
      id: site.site_id, name: site.site_name || '', isActive: site.isactive,
      contactName: site.contact_person || '', contactNo: site.contactno || '',
      category: site.category_id || '', email: site.email || '',
      address: site.address || '', city: site.city || ''
    });
    setModal({ open: true, mode: 'edit', site });
  };

  const handleSave = async () => {
    if (!formSite.name.trim()) return;
    setLoading(true);
    try {
      if (modal.mode === 'add') {
        await addSite(formSite);
        setToastMessage('Site added successfully!');
      } else {
        await editSite(formSite);
        setToastMessage('Site updated successfully!');
      }
      setRefresh(prev => !prev);
      setModal({ open: false, mode: 'add', site: null });
    } catch {
      setToastError('Something went wrong.');
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    setSites(prev => prev.filter(s => s.site_id !== id));
    setToastError('Site deleted.');
  };

  const cities = [...new Set(sites.map(site => site.city).filter(Boolean))];

  return (
    <div className="px-2 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Site Master</h2>
        <button
          onClick={openAddModal}
          className="bg-slate-600 text-white px-4 py-1 rounded text-sm hover:bg-slate-100 hover:text-slate-600 transition duration-200"
        >
          + Add Site
        </button>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterCity={filterCity} setFilterCity={setFilterCity}
        // filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        cities={cities} categories={categories}
        setCurrentPage={setCurrentPage}
        showCityFilter={true}
        showCategoryFilter={true} // Hide category filter
        showStatusFilter={false} // Show status filter
      />

      {filteredSites.length > 0 && (
        <p className="text-sm text-gray-500 mb-2">
          Showing {(currentPage - 1) * itemsPerPage + 1}
          –
          {Math.min(currentPage * itemsPerPage, filteredSites.length)} of {filteredSites.length} sites
        </p>
      )}
      <table className="w-full text-sm shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Category</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Manager</th>
            <th className="px-3 py-2 text-left">Contact No</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {paginatedSites.length ? paginatedSites.map(site => (
            <tr key={site.site_id} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{site.site_name}</td>
              <td className="px-3 py-2">{site.category_name || 'N/A'}</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${site.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {site.isactive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-3 py-2">{site.contact_person || 'N/A'}</td>
              <td className="px-3 py-2">{site.contactno || 'N/A'}</td>
              <td className="px-3 py-2">{site.email || 'N/A'}</td>
              <td className="px-3 py-2 space-x-2">
                <button onClick={() => openEditModal(site)} className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => { setConfirmationModal(true); setMessage('Are you sure?'); setSiteId(site.site_id); }} className="text-red-600 hover:underline text-sm">Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={7} className="text-center py-4 text-gray-500">No sites found.</td></tr>
          )}
        </tbody>
      </table>

      <PaginationControls totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {modal.open && (
        <SiteModal
          open={modal.open}
          mode={modal.mode}
          formSite={formSite}
          categoryList={categories}
          setFormSite={setFormSite}
          onClose={() => setModal({ open: false, mode: 'add', site: null })}
          onSave={handleSave}
          loading={loading}
        />
      )}

      {confirmationModal && (
        <ConfirmationModal
          show={confirmationModal}
          handleClose={() => setConfirmationModal(false)}
          message={message}
          handleApprove={() => {
            handleDelete(siteId);
            setConfirmationModal(false);
          }}
        />
      )}

      {toastMessage && <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />}
      {toastError && <ToastError message={toastError} onClose={() => setToastError('')} />}

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-600"></div>
          <span className="ml-4 text-slate-700 font-medium">Loading...</span>
        </div>
      )}
    </div>
  );
}
