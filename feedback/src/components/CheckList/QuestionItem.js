import { Camera } from 'lucide-react';

const QuestionItem = ({ item, response = {}, onRespond, onImageUpload }) => {
  return (
    <div className="bg-slate-50 p-4 mb-4 rounded-lg border-l-4 hover:border-slate-500 transition-all">
      <p className="text-slate-800 font-medium mb-2">{item.question}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => onRespond('Yes')}
          className={`px-6 py-1 rounded-lg font-semibold border ${
            response.response === 'Yes' ? 'bg-white text-green-500 border-green-500' : 'bg-white text-slate-600 border-slate-500'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onRespond('No')}
          className={`px-6 py-1 rounded-lg font-semibold border ${
            response.response === 'No' ? 'bg-white text-red-500 border-red-500' : 'bg-white text-slate-600 border-slate-500'
          }`}
        >
          No
        </button>
          
        {(item.isImg_Require === 'Yes' || item.isimg_require === true)  && (
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <Camera />
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onImageUpload(e.target.files[0])}
            />
          </label>
        )}

        {response.image && (
          <img src={response.image} alt="preview" className="h-12 rounded border" />
        )}
      </div>
    </div>
  );
};

export default QuestionItem;
