import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { formatDate } from '../components/common/DateFormat';
import { getFeedbackDetails } from '../services/FeedbackServices';
import FeedbackFilter from '../components/feedback/FeedbackFilter';
import Pagination from '../components/feedback/Pagination';
import getInitials from '../components/common/getInitials';
import getColorFromString from '../components/common/getColor';

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState({ value: 'All', label: 'All Status' });
  const [siteFilter, setSiteFilter] = useState({ value: 'All', label: 'All Sites' });
  const [feedbackData, setFeedbackData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchFeedback = async () => {
      const result = await getFeedbackDetails();
      setFeedbackData(result.data);
    };
    fetchFeedback();
  }, []);

  const uniqueSites = Array.from(new Set(feedbackData.map(fb => fb.site)))
    .map(site => ({ value: site, label: site }));

  const siteOptions = [{ value: 'All', label: 'All Sites' }, ...uniqueSites];

  const filteredFeedback = useMemo(() => {
    return feedbackData.filter(fb => {
      const matchesSearch = fb.user.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter.value === 'All' || fb.status === statusFilter.value;
      const matchesSite = siteFilter.value === 'All' || fb.site === siteFilter.value;
      return matchesSearch && matchesStatus && matchesSite;
    });
  }, [feedbackData, searchTerm, statusFilter, siteFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedback.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const maxPage = Math.ceil(filteredFeedback.length / itemsPerPage);
    if (currentPage > maxPage) setCurrentPage(maxPage || 1);
  }, [filteredFeedback.length, currentPage]);

  const getStatusClasses = (status) =>
    status === 'satisfied'
      ? 'bg-green-100 text-green-800'
      : 'bg-rose-100 text-rose-800';

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold mb-4">Feedback Management</h1>

      {/* Filters */}
      <FeedbackFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCity={siteFilter}
        setFilterCity={setSiteFilter}
        filterStatus={statusFilter}
        setFilterStatus={setStatusFilter}
        setCurrentPage={setCurrentPage}
        cities={siteOptions}
        showStatusFilter={true}
        showCityFilter={true}
      />

      {/* Table */}
      <div className="bg-white border-gray-500 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[768px] text-sm relative">
          <thead className="bg-white border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">User Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Site</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Feedback</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              currentItems.map((fb) => (
                <tr key={fb.id || fb.email + fb.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
                        style={{ backgroundColor: getColorFromString(getInitials(fb.user) || '') }}>
                        {getInitials(fb.user)}
                      </div>
                      <div className='ps-2'>
                        <div className="font-medium text-gray-900">{fb.user}</div>
                        <div className="text-gray-500 text-xs">{fb.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatDate(fb.date)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                      {fb.site}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClasses(fb.status)}`}>
                      {fb.status === 'satisfied' ? 'Satisfied' : 'Not Satisfied'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(i =>
                        i <= fb.rating ? (
                          <Star key={i} className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                        ) : (
                          <Star key={i} className="text-yellow-400 w-4 h-4" />
                        )
                      )}
                      <span className="ml-2 text-gray-600">{parseFloat(fb.rating).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate group relative" style={{ overflow: 'visible' }}>
                    <div className="truncate">{fb.comment}</div>

                    {/* Tooltip */}
                    <div className="absolute z-50 hidden group-hover:flex w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none break-words whitespace-pre-wrap">
                      {fb.comment}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredFeedback.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Feedback;
