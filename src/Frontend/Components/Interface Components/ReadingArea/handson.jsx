import React from 'react';
import CodeEditor from '../../Code Components/CodeEditor';

const HandsOn = ({ title, description, defaultCode }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-400">{title}</h2>
      <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
        <p className="text-gray-300 mb-4">{description}</p>
        <CodeEditor defaultCode={defaultCode} />
      </div>
    </section>
  );
};

export default HandsOn;
