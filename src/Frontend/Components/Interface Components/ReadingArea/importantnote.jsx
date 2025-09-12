import React from 'react';

const ImportantNote = ({ title, points, variant = 'yellow' }) => {
  const variants = {
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };

  return (
    <div className={`p-4 rounded-xl border ${variants[variant]}`}>
      <h3 className="text-lg font-medium mb-2">⚠️ {title}</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-300">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default ImportantNote;
