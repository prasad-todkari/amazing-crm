import React, { useState } from "react";

const CommentTooltip = ({ comment }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="truncate">{comment}</span>
      {show && (
        <div className="absolute z-50 w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg top-full mt-2 left-1/2 -translate-x-1/2">
          {comment}
        </div>
      )}
    </div>
  );
};

export default CommentTooltip;