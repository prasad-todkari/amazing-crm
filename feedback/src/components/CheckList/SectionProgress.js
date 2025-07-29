const SectionProgress = ({ progress, section, total, title }) => (
  <div className="text-center">
    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{title || "Inspection Form"}</h1>
    <p className="text-slate-600 mb-4">Complete all questions to progress</p>
    <div className="mb-2 flex justify-between text-sm text-slate-600">
      <span>Progress: {progress}%</span>
      <span>Section {section} of {total}</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-slate-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default SectionProgress;