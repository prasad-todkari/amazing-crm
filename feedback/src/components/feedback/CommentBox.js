const CommentBox = ({ value, onChange, refProp }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
    <textarea
      ref={refProp}
      value={value}
      onChange={onChange}
      placeholder="Share your detailed feedback..."
      maxLength={500}
      rows={4}
      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-slate-500 focus:outline-none"
    />
    <p className="mt-1 text-sm text-gray-500">{value.length}/500 characters</p>
  </div>
);

export default CommentBox;