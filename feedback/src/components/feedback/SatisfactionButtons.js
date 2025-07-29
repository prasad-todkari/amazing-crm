import { Smile, Frown } from "lucide-react";

const SatisfactionButtons = ({ value, onClick, error }) => (
  <div className="space-y-4 justify-center">
    <label className="block text-sm font-medium text-gray-700">How satisfied are you? *</label>
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => onClick("satisfied")}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${value === "satisfied" ? "bg-green-500 text-white" : "bg-slate-700 hover:bg-slate-500 text-white"}`}
      >
        <Smile className="w-6 h-6" />
        <span>Satisfied</span>
      </button>
      <button
        type="button"
        onClick={() => onClick("not_satisfied")}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${value === "not_satisfied" ? "bg-red-500 text-white" : "bg-slate-700 hover:bg-slate-500 text-white"}`}
      >
        <Frown className="w-6 h-6" />
        <span>Not Satisfied</span>
      </button>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default SatisfactionButtons;