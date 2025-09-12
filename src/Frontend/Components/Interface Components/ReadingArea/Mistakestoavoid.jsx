import React from 'react';

const MistakesToAvoid = ({ title, mistakes, alternatives, variant = 'red' }) => {
  const variants = {
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400'
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${variants[variant]}`}>
        <h3 className="text-lg font-medium mb-2">⚠️ {title}</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          {mistakes.map((mistake, index) => (
            <li key={index}>{mistake}</li>
          ))}
        </ul>
      </div>
      
      {alternatives && (
        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <h3 className="text-lg font-medium text-blue-400 mb-2">💡 Better Approaches:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {alternatives.map((alt, index) => (
              <li key={index}>{alt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MistakesToAvoid;
