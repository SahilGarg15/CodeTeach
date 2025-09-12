import React from 'react';
import CodeSnippet from '../Code Components/CodeSnippet';

const ViewSolution = ({ solution, isExpanded, onToggle }) => {
  return (
    <div className="border border-green-500/20 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 bg-green-500/10 text-green-400 
          hover:bg-green-500/20 transition-colors duration-200 text-left
          flex items-center justify-between"
      >
        <span>View Solution</span>
        <span>✨</span>
      </button>
      {isExpanded && (
        <div className="border-t border-green-500/20">
          <CodeSnippet
            code={solution}
            language="java"
            showLineNumbers={true}
            showCopyButton={true}
          />
        </div>
      )}
    </div>
  );
};

export default ViewSolution;
