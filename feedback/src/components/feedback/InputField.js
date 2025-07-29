
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`mt-1 block w-full border-b-2 border-gray-300 focus:border-slate-500 focus:outline-none ${error ? "border-red-500" : ""}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default InputField;