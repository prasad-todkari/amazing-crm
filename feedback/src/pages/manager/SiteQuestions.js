import { useEffect, useState } from "react";
import { getAllSites, getQuestions, selectedQuestions } from "../../services/siteServices";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { ToastSuccess, ToastError } from '../../components/common/Toast';

const QuestionSelector = () => {
  const [siteId, setSiteId] = useState("");
  const [siteName, setSiteName] = useState('');
  const [availableSites, setAvailableSites] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [message, setMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastError, setToastError] = useState('')

  // Fetch available sites on mount
  useEffect(() => {
    const resp = async () => {
      const sitelist = await getAllSites()
      setAvailableSites(sitelist.data)
    }
    resp()
  }, []);

  // Fetch questions when site is selected and "Search" is clicked
  const fetchQuestions = async () => {
    if (!siteId) return;
    setLoading(true);
    const res = await getQuestions({ site_id: siteId });
    setQuestions(res.data);
    setFilteredQuestions(res.data);
    setSearchTerm("");
    setLoading(false);
  };

  // Handle checkbox toggle
  const handleChange = (question_id) => {
    setQuestions(prev =>
      prev.map(q => q.question_id === question_id ? { ...q, selected: !q.selected } : q)
    );
    setFilteredQuestions(prev =>
      prev.map(q => q.question_id === question_id ? { ...q, selected: !q.selected } : q)
    );
  };

  // Handle Save
  const handleSave = async () => {
    const selectedIds = questions.filter(q => q.selected).map(q => q.question_id);
    const saveselected = await selectedQuestions({ siteId, selectedIds })
    if (saveselected.data.status === 'success') {
      setToastMessage('Updated Successfully')
    } else {
      setToastError('error while adding records')
    }
    alert("Saved!");
    setQuestions([]);
    setFilteredQuestions([]);
    setConfirmationModal(false)
  };

  // Handle search input
  const handleSearchInput = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredQuestions(
      questions.filter(q => q.question_text.toLowerCase().includes(term))
    );
  };


  return (
    <div className="max-w-6xl mx-auto p-3 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Site Question Manager</h2>

      {/* Site Selector */}
      <div className="sticky top-0 z-10 bg-white pb-4 pt-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Site dropdown */}
          <select
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              const selectedOption = e.target.options[e.target.selectedIndex];
              setSiteName(selectedOption.text);
            }}
            className="border px-4 py-2 rounded w-full md:w-64"
          >
            <option value="">-- Select Site --</option>
            {availableSites.map(site => (
              <option key={site.site_id} value={site.site_id}>
                {site.site_name}
              </option>
            ))}
          </select>

          {/* Search button */}
          <button
            onClick={fetchQuestions}
            className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition w-full md:w-auto"
          >
            Search
          </button>

          {/* Search input */}
          {questions.length > 0 && (
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearchInput}
              className="border px-4 py-2 rounded w-full md:w-72"
            />
          )}
        </div>
      </div>


      {/* Questions list */}
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto">
          {/* <ul className="space-y-2">
          {filteredQuestions.map(q => (
            <li key={q.question_id} className="flex items-center gap-4 text-small border p-2 rounded hover:shadow">
             <input
                type="checkbox"
                checked={q.selected}
                onChange={() => handleChange(q.question_id)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{q.question_text}</span>
            </li>
          ))}
        </ul> */}

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map(q => (
              <li key={q.question_id} className="flex items-center gap-4 border p-3 rounded hover:shadow">
                <input
                  type="checkbox"
                  checked={q.selected}
                  onChange={() => handleChange(q.question_id)}
                  className="w-5 h-5 text-slate-500 focus:ring-slate-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{q.question_text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Save Button */}
      {questions.length > 0 && (
        <button
          onClick={() => {
            setConfirmationModal(true);
            setMessage(`Are you sure you want to Update Questions for Site - ${siteName}`);
          }}
          className="mt-6 px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
        >
          Save Changes
        </button>
      )}

      <ConfirmationModal
        show={confirmationModal}
        handleClose={() => setConfirmationModal(false)}
        message={message}
        handleApprove={() => handleSave()}
      />

      {/* Toast */}
      {message && (
        <ToastSuccess message={toastMessage} onClose={() => setMessage('')} />
      )}
      {toastError && (
        <ToastError message={toastError} onClose={() => setToastError('')} />
      )}
    </div>
  );
};

export default QuestionSelector;
