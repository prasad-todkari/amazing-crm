export function ToastSuccess({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-50">
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-sm underline hover:text-gray-200"
      >
        Close
      </button>
    </div>
  );
}

export function ToastError({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-50">
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-sm underline hover:text-gray-200"
      >
        Close
      </button>
    </div>
  );
}
