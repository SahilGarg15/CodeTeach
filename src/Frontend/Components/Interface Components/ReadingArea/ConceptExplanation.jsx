import React from 'react';

const ConceptExplanation = ({ sections }) => {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          <h3 className="text-xl font-medium text-indigo-400 mb-3 flex items-center gap-2">
            {section.icon && <span>{section.icon}</span>}
            {section.title}
          </h3>
          <div className="space-y-4 text-gray-300">
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.code && (
              <div className="bg-gray-900/50 p-4 rounded-md mt-2">
                <code className="text-sm text-gray-300">{section.code}</code>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConceptExplanation;
