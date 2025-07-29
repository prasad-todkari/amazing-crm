const NavigationButtons = ({ isFirst, isLast, onPrevious, onNext, onSubmit }) => (
  <div className="flex justify-between mt-6">
    <button
      disabled={isFirst}
      onClick={onPrevious}
      className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
    >
      Previous
    </button>
    {!isLast ? (
      <button
        onClick={onNext}
        className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
      >
        Next Section
      </button>
    ) : (
      <button
        onClick={onSubmit}
        className="px-6 py-2 bg-white text-green-500 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white"
      >
        Submit Inspection
      </button>
    )}
  </div>
);

export default NavigationButtons;
