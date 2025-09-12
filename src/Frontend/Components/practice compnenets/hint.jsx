import React from 'react';

const Hint = ({ hint, isExpanded, onToggle }) => {
  return (
    <div className="mt-4 border border-yellow-500/20 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 bg-yellow-500/10 text-yellow-400 
          hover:bg-yellow-500/20 transition-colors duration-200 text-left
          flex items-center justify-between"
      >
        <span>View Hint</span>
        <span>💡</span>
      </button>
      {isExpanded && (
        <div className="p-4 bg-yellow-500/5 border-t border-yellow-500/20">
          <p className="text-gray-300">{hint}</p>
        </div>
      )}
    </div>
  );
};

export default Hint;
