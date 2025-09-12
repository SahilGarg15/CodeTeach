import React from 'react';

const KeyFeatures = ({ title, items, variant = 'blue' }) => {
  const getGradients = () => {
    const gradients = {
      blue: 'from-blue-500/10 to-blue-700/10 border-blue-500/20 text-blue-400',
      purple: 'from-purple-500/10 to-purple-700/10 border-purple-500/20 text-purple-400',
      green: 'from-green-500/10 to-green-700/10 border-green-500/20 text-green-400'
    };
    return gradients[variant] || gradients.blue;
  };

  return (
    <div className={`p-6 bg-gradient-to-br ${getGradients()} rounded-xl border`}>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <ul className="space-y-3 text-gray-300">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-2xl">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyFeatures;
