import React from 'react';

const Summary = ({ title, description, variant = 'blue' }) => {
  const getGradient = () => {
    const gradients = {
      blue: 'from-blue-500/10 to-purple-500/10 border-blue-500/20',
      green: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
      purple: 'from-purple-500/10 to-indigo-500/10 border-purple-500/20'
    };
    return gradients[variant] || gradients.blue;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        {title}
      </h1>
      <div className={`p-6 bg-gradient-to-br ${getGradient()} rounded-xl border`}>
        <p className="text-gray-300 text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Summary;
