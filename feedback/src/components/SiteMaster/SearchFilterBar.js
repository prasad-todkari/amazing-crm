import { RefreshCcw } from "lucide-react";
import Select from 'react-select' 

export default function SearchFilterBar({
  searchTerm, setSearchTerm,
  filterCity, setFilterCity,
  filterCategory, setFilterCategory,
  setCurrentPage,
  cities = [], categories = []
}) {
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCity('');
    setFilterCategory('');
    setCurrentPage(1);
  };

  // Prepare options for react-select
  const cityOptions = [
    { value: '', label: 'All Cities' }, // Add "All Cities" option
    ...cities.map(city => ({ value: city, label: city }))
  ];
  const categoryOptions = [
    { value: '', label: 'All Categories' }, // Add "All Categories" option
    ...categories.map(cat => ({ value: cat.category_id, label: cat.category_name }))
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-grow">
        <input
          type="text"
          placeholder="Search by site name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full sm:w-64"
        />

        <Select
          value={cityOptions.find(option => option.value === filterCity) || null}
          onChange={(selectedOption) => {
            setFilterCity(selectedOption ? selectedOption.value : '');
            setCurrentPage(1);
          }}
          options={cityOptions}
          placeholder="All Cities"
          className="w-full sm:w-48"
        />
        <Select
          value={categoryOptions.find(option => option.value === filterCategory) || null}
          onChange={(selectedOption) => {
            setFilterCategory(selectedOption ? selectedOption.value : '');
            setCurrentPage(1);
          }}
          options={categoryOptions}
          placeholder="All Categories"
          className="w-full sm:w-48"
        />

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
