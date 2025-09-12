import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import CopyButton from './CopyButton';

const CodeSnippet = ({ 
  code = '', 
  title, 
  language = 'java', 
  showCopyButton = true 
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className="rounded-xl border border-gray-800/40 bg-gray-900/50">
      <div className="px-4 py-2.5 flex items-center justify-between bg-gray-900/90 border-b border-gray-800/40">
        <div className="flex items-center gap-3">
          {title && <span className="text-sm font-medium text-gray-300">{title}</span>}
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full 
            bg-blue-500/10 text-blue-400/90 border border-blue-500/20">
            {language.toUpperCase()}
          </span>
        </div>
        
        {showCopyButton && <CopyButton textToCopy={code} />}
      </div>

      <pre className="!m-0 !bg-transparent overflow-x-auto">
        <code className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};

export default CodeSnippet;