import React from 'react';

const BinaryVisualization = ({ title, numbers }) => {
  return (
    <section className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
      <h3 className="text-xl font-medium text-blue-400 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {numbers.map((item, index) => (
          <div key={index} className="space-y-2">
            <p className="text-gray-300">{item.label}:</p>
            <div className="grid grid-cols-8 gap-1">
              {item.bits.map((bit, i) => (
                <div key={i} className={`p-2 text-center rounded ${
                  bit ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/20 text-gray-400'
                }`}>
                  {bit}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BinaryVisualization;
