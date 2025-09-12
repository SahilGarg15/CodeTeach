import React from 'react';


const BinaryExplanation = ({ title, items, description }) => {
  return (
    <section className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
      <h2 className="text-2xl font-semibold text-green-400 mb-4">{title}</h2>
      {description && (
        <p className="text-gray-300 mb-4">{description}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-lg text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-gray-300 text-sm">{item.name}</div>
            <div className="text-blue-400 font-mono">{item.size}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BinaryExplanation;
