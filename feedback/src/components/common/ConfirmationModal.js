import React from 'react';
const ConfirmationModal = ({ show, handleClose, handleApprove, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-1/3 z-10">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Confirm Action</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="p-4">
          <p>{message}</p>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={handleClose}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
