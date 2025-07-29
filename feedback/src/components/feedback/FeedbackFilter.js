import { RefreshCcw } from "lucide-react";
import Select from 'react-select';

export default function FeedbackFilter({
  searchTerm, setSearchTerm,
  filterCity, setFilterCity,
  filterStatus, setFilterStatus,
  setCurrentPage,
  cities = [],
  showStatusFilter = false,
  showCityFilter = false
}) {
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCity({ value: 'All', label: 'All Sites' });
    setFilterStatus({ value: 'All', label: 'All Status' });
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-grow">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full sm:w-64"
        />

        {showCityFilter && (
          <Select
            value={filterCity}
            onChange={(selectedOption) => {
              setFilterCity(selectedOption);
              setCurrentPage(1);
            }}
            options={cities}
            placeholder="All Sites"
            className="w-full sm:w-48"
          />
        )}

        {showStatusFilter && (
          <Select
            value={filterStatus}
            onChange={(selectedOption) => {
              setFilterStatus(selectedOption);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'satisfied', label: 'Satisfied' },
              { value: 'not_satisfied', label: 'Not Satisfied' }
            ]}
            placeholder="All Statuses"
            className="w-full sm:w-48"
          />
        )}

        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1 bg-gray-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-400 transition"
          title="Reset filters"
        >
          <RefreshCcw size={16} className="text-white" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
