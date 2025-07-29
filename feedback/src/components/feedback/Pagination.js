import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [inputPage, setInputPage] = useState('');

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = new Set();

    // Add current page, 2 pages before, and 2 pages after
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pages.add(i);
      }
    }

    // Always include first and last pages
    pages.add(1);
    pages.add(totalPages);

    // Convert to array and sort numerically
    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    // Insert ellipses for gaps
    const result = [];
    for (let i = 0; i < sortedPages.length; i++) {
      result.push(sortedPages[i]);
      // Add ellipsis if the next page is not consecutive and not the last page
      if (
        i < sortedPages.length - 1 &&
        sortedPages[i + 1] - sortedPages[i] > 1
      ) {
        result.push('...');
      }
    }

    return result;
  };

  const visiblePages = getVisiblePages();

  const handlePageInput = (e) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setInputPage('');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-6 px-4">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-slate-100 flex items-center"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page buttons */}
      <div className="flex space-x-1">
        {visiblePages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-1 text-sm text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded hover:bg-slate-200 hover:text-slate-700 ${
                page === currentPage ? 'bg-slate-600 text-white' : ''
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-slate-100 flex items-center"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page input */}
      <form onSubmit={handlePageInput} className="flex items-center space-x-2">
        <label htmlFor="page-input" className="text-sm">
          Go to page:
        </label>
        <input
          id="page-input"
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-16 px-2 py-1 border rounded text-sm"
          placeholder="Page"
        />
        <button
          type="submit"
          className="px-2 py-1 text-sm bg-slate-600 text-white rounded hover:bg-slate-700"
        >
          Go
        </button>
      </form>
    </div>
  );
}