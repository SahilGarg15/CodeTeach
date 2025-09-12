import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Folder, File, X, Plus, Save, Trash, Copy, Download, Play } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { debounce } from 'lodash';
import { useMediaQuery } from 'react-responsive';  // Add this import

// Add TerminalHandler class at the top
class TerminalHandler {
  constructor() {
    this.inputs = [];
    this.lastOutput = '';
  }

  clear() {
    this.inputs = [];
    this.lastOutput = '';
  }

  addInput(input) {
    this.inputs.push(input);
  }

  getAllInputs() {
    return this.inputs.join('\n');
  }

  isWaitingForInput(output) {
    const inputPatterns = [
      /\?[\s]*$/,
      /:\s*$/,
      /input/i,
      /enter/i,
      /Scanner/,
      /nextLine|next\w+/
    ];

    const newOutput = output.substring(this.lastOutput.length);
    this.lastOutput = output;

    return inputPatterns.some(pattern => pattern.test(newOutput));
  }
}

// Add download helper function
const downloadCode = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Update CopyButton with more modern styling
const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const variants = {
    default: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300',
    primary: 'bg-blue-600/80 hover:bg-blue-700/80 text-white',
    success: 'bg-green-600/80 hover:bg-green-700/80 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`p-1.5 md:px-3 md:py-1.5 text-xs rounded-md transition-all duration-200 
        flex items-center gap-1 md:gap-2 border border-gray-700/50 ${variants[variant]}`}
    >
      <Icon size={isMobile ? 16 : 14} />
      {label && <span className="hidden md:inline">{label}</span>}
    </button>
  );
};

const getDefaultContent = (filename) => {
  if (filename.endsWith('.java')) {
    const className = filename.replace('.java', '');
    return `public class ${className} {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello World!");
    }
}`;
  }
  return '// Write your code here';
};

const CodingArea = ({ onClose }) => {
  const [files, setFiles] = useState(() => {
    const savedFiles = localStorage.getItem('codeFiles');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });
  const [activeFile, setActiveFile] = useState(null);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [input, setInput] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // Add save status state
  const [autoExecute, setAutoExecute] = useState(false);
  const latestContentRef = useRef('');  // To track latest content
  const [currentContent, setCurrentContent] = useState('');
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(!isMobile);
  const fileExplorerRef = useRef(null);

  // Add new state variables
  const terminalHandler = useRef(new TerminalHandler());
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [showInputSection, setShowInputSection] = useState(false);
  const [expectedInputCount, setExpectedInputCount] = useState(0);
  const [state, setState] = useState({
    status: 'idle',
    error: null,
    currentInputIndex: 0,
    expectedInputs: 0,
    inputHistory: [],
    historyIndex: -1
  });

  useEffect(() => {
    localStorage.setItem('codeFiles', JSON.stringify(files));
  }, [files]);

  const handleCreateFile = () => {
    if (!newFileName) return;
    const newFile = {
      id: Date.now(),
      name: newFileName.includes('.') ? newFileName : `${newFileName}.js`,
      content: getDefaultContent(newFileName.includes('.') ? newFileName : `${newFileName}.js`),
      created: new Date().toISOString()
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile);
    setNewFileName('');
    setShowNewFileDialog(false);
  };

  // Add function to validate Java class name
  const validateJavaClassName = useCallback((content, filename) => {
    if (!filename.endsWith('.java')) return true;
    
    const className = filename.replace('.java', '');
    const classPattern = new RegExp(`public\\s+class\\s+${className}\\s*{`);
    
    if (!classPattern.test(content)) {
      setError(`Error: Class name must be "${className}" to match the file name`);
      return false;
    }
    return true;
  }, []);

  // Add new utility function
  const countExpectedInputs = useCallback((code) => {
    const matches = code.match(/\b(nextInt|nextLine|nextDouble|nextFloat|nextBoolean|next|readLine|read)\b/g);
    return matches ? matches.length : 0;
  }, []);

  // Modify executeCode function
  const executeCode = useCallback(async (fileContent, language, inputs = '') => {
    if (!fileContent) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const isJava = language === 'java';
      const contentToExecute = fileContent || currentContent;
      
      if (isJava && activeFile) {
        if (!validateJavaClassName(contentToExecute, activeFile.name)) {
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: isJava ? 'java' : 'javascript',
          version: isJava ? '15.0.2' : '*',
          files: [{
            name: isJava ? 'Main.java' : 'index.js',
            content: contentToExecute
          }],
          stdin: inputs
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setError(data.message);
        return;
      }
      const output = data.run.output || data.run.stderr;
      setOutput(output);
      setTerminalHistory(prev => [...prev, { type: 'output', content: output }]);

      // Check if program is waiting for more input
      if (terminalHandler.current.isWaitingForInput(output)) {
        setState(prev => ({ ...prev, status: 'waiting_input' }));
      } else {
        setState(prev => ({ ...prev, status: 'idle' }));
      }

    } catch (err) {
      setError('Failed to execute code. Please try again.');
      setTerminalHistory(prev => [...prev, { type: 'error', content: err.message }]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFile, currentContent, validateJavaClassName]);

  // Add handleInput function
  const handleInput = useCallback((inputValue) => {
    if (!inputValue?.trim() || state.status !== 'waiting_input') return;

    const terminal = terminalHandler.current;
    terminal.addInput(inputValue.trim());

    setTerminalHistory(prev => [...prev, 
      { type: 'input', content: `> ${inputValue}` }
    ]);

    // Run with all collected inputs so far
    executeCode(
      activeFile.content,
      activeFile.name.endsWith('.java') ? 'java' : 'javascript',
      terminal.getAllInputs()
    );
  }, [state.status, activeFile, executeCode]);

  // Modify the Run button click handler
  const handleRunCode = useCallback(() => {
    const terminal = terminalHandler.current;
    terminal.clear();
    setTerminalHistory([]);
    
    const inputCount = countExpectedInputs(currentContent);
    if (inputCount > 0) {
      setExpectedInputCount(inputCount);
      setShowInputSection(true);
      setTerminalHistory([{ type: 'system', content: '⚡ Waiting for inputs...' }]);
      return;
    }

    setState(prev => ({ ...prev, status: 'running' }));
    setTerminalHistory([{ type: 'system', content: '⚡ Running program...' }]);
    executeCode(currentContent, activeFile.name.endsWith('.java') ? 'java' : 'javascript');
  }, [currentContent, activeFile, countExpectedInputs, executeCode]);

  // Update handleFileChange to use a debounced execute
  const debouncedExecute = useCallback(
    debounce((content, language) => {
      executeCode(content, language);
    }, 1000),
    [executeCode]
  );

  // Update handleFileChange to include auto-save and validation
  const handleFileChange = useCallback((value) => {
    if (!activeFile) return;

    setCurrentContent(value);
    latestContentRef.current = value;

    // Validate Java class name
    if (activeFile.name.endsWith('.java')) {
      validateJavaClassName(value, activeFile.name);
    }

    // Update file content
    setFiles(prev => prev.map(f => 
      f.id === activeFile.id ? { ...f, content: value } : f
    ));

    // Auto-execute if enabled
    if (autoExecute && !error) {
      debouncedExecute(
        value,
        activeFile.name.endsWith('.java') ? 'java' : 'javascript'
      );
    }

    // Show saving status
    setSaveStatus('Saving...');

    // Debounced save to localStorage
    const saveToStorage = debounce(() => {
      localStorage.setItem('codeFiles', JSON.stringify(files));
      setSaveStatus('All changes saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);

    saveToStorage();

    return () => saveToStorage.cancel();
  }, [activeFile, files, validateJavaClassName, autoExecute, debouncedExecute, error]);

  const handleDeleteFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFile?.id === fileId) {
      setActiveFile(null);
    }
  };

  // Update file selection to close menu on mobile
  const handleFileSelect = useCallback((file) => {
    setActiveFile(file);
    if (isMobile) {
      setIsFileExplorerOpen(false);
    }
  }, [isMobile]);

  // Update editor options for better mobile scrolling
  const editorOptions = useMemo(() => ({
    minimap: { enabled: !isMobile },
    fontSize: isMobile ? Math.max(14, fontSize) : Math.max(12, fontSize),
    scrollBeyondLastLine: false,
    lineNumbers: isMobile ? 'off' : 'on',
    lineNumbersMinChars: 3,  // Make line numbers width smaller
    roundedSelection: false,
    padding: { top: 16 },
    automaticLayout: true,
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: true,
      verticalScrollbarSize: isMobile ? 12 : 8,
      horizontalScrollbarSize: isMobile ? 12 : 8,
      alwaysConsumeMouseWheel: false,
      arrowSize: isMobile ? 15 : 11
    },
    mouseWheelScrollSensitivity: isMobile ? 2 : 1,
    touchScrollSensitivity: 2,
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    glyphMargin: false,  // Disable glyph margin to save space
    folding: true,
    // Modern editor styling
    renderLineHighlight: 'all',
    contextmenu: false,
    cursorBlinking: 'smooth',
    smoothScrolling: true,
    padding: { top: 20, bottom: 20 },
    lineDecorationsWidth: 5,
    renderIndentGuides: true,
    colorDecorators: true,
    bracketPairColorization: {
      enabled: true,
    },
    wordWrap: isMobile ? 'on' : 'off',
  }), [fontSize, isMobile]);

  const debouncedResize = useCallback(
    debounce((editor) => {
      if (editor) {
        editor.layout();
      }
    }, 100),
    []
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (editorRef.current) {
        debouncedResize(editorRef.current);
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      debouncedResize.cancel();
    };
  }, [debouncedResize]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      debouncedExecute.cancel();
    };
  }, [debouncedExecute]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (activeFile) {
      setCurrentContent(activeFile.content);
    }
  }, [activeFile]);

  const toggleFileExplorer = useCallback(() => {
    setIsFileExplorerOpen(prev => !prev);
  }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && 
          fileExplorerRef.current && 
          !fileExplorerRef.current.contains(event.target) &&
          !event.target.closest('button[aria-label="toggle-file-explorer"]')) {
        setIsFileExplorerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile]);

  // Update InputSection component
  const InputSection = () => {
    const [inputValues, setInputValues] = useState(Array(expectedInputCount).fill(''));
    const [inputTypes, setInputTypes] = useState(Array(expectedInputCount).fill('text'));
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [bulkInput, setBulkInput] = useState('');

    const handleBulkInputChange = (value) => {
      setBulkInput(value);
      const values = value.split('\n').map(v => v.trim());
      setInputValues(prev => {
        const newValues = [...prev];
        values.forEach((v, i) => {
          if (i < expectedInputCount) newValues[i] = v;
        });
        return newValues;
      });
    };

    const handleSubmitInputs = (e) => {
      e.preventDefault();
      const finalInputs = showBulkInput ? 
        bulkInput.split('\n').slice(0, expectedInputCount) : 
        inputValues;

      if (finalInputs.filter(input => input.trim() !== '').length === expectedInputCount) {
        executeCode(
          currentContent,
          activeFile.name.endsWith('.java') ? 'java' : 'javascript',
          finalInputs.join('\n')
        );
        setShowInputSection(false);
      }
    };

    const inputTypeOptions = [
      { value: 'text', label: 'Text' },
      { value: 'number', label: 'Number' },
      { value: 'boolean', label: 'Boolean' }
    ];

    return (
      <div className={`transform transition-all duration-300 ease-in-out overflow-hidden
                      ${showInputSection ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 my-2">
          <h3 className="text-sm text-gray-300 mb-3">Program requires {expectedInputCount} input(s)</h3>
          <form onSubmit={handleSubmitInputs} className="space-y-3">
            {Array(expectedInputCount).fill(0).map((_, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-xs text-gray-400">Input {index + 1}:</span>
                <input
                  type={inputTypes[index]}
                  value={inputValues[index]}
                  onChange={(e) => {
                    const newValues = [...inputValues];
                    newValues[index] = e.target.value;
                    setInputValues(newValues);
                  }}
                  className="flex-1 bg-gray-900/90 border border-gray-700/50 rounded px-3 py-1.5
                           text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
                  placeholder={`Enter input ${index + 1}`}
                />
                <select
                  value={inputTypes[index]}
                  onChange={(e) => {
                    const newTypes = [...inputTypes];
                    newTypes[index] = e.target.value;
                    setInputTypes(newTypes);
                  }}
                  className="bg-gray-900/90 border border-gray-700/50 rounded px-2 py-1.5
                           text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
                >
                  {inputTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showBulkInput}
                onChange={(e) => setShowBulkInput(e.target.checked)}
                className="rounded border-gray-600"
              />
              <span className="text-xs text-gray-400">Bulk Input</span>
            </div>
            {showBulkInput && (
              <textarea
                value={bulkInput}
                onChange={(e) => handleBulkInputChange(e.target.value)}
                className="w-full bg-gray-900/90 border border-gray-700/50 rounded px-3 py-1.5
                         text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
                placeholder="Enter inputs separated by new lines"
                rows={expectedInputCount}
              />
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600/80 text-white rounded-md hover:bg-blue-700/80
                       transition-all duration-200 text-sm font-medium"
            >
              Submit Inputs
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-2 border-b border-gray-800/50">
          <button
            onClick={toggleFileExplorer}
            aria-label="toggle-file-explorer"
            className="p-2 rounded-lg bg-gray-800/50 text-gray-400"
          >
            <Folder size={20} />
          </button>
          <span className="text-gray-200 font-medium">
            {activeFile?.name || 'Code Editor'}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-800/50 text-gray-400"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* File Explorer - Make it conditionally visible */}
      <div 
        ref={fileExplorerRef}
        className={`
        ${isFileExplorerOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'absolute z-20 h-full' : 'relative'}
        w-56 md:w-64 border-r border-gray-800/50 flex flex-col bg-gray-900/50 
        backdrop-blur-sm transition-transform duration-200
      `}>
        <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
          <h2 className="text-gray-200 font-medium tracking-wide">Files</h2>
          <button
            onClick={() => setShowNewFileDialog(true)}
            className="p-1.5 rounded-lg hover:bg-gray-800/70 text-gray-400 
              transition-colors duration-200"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* File list with refined styling */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => handleFileSelect(file)}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer
                transition-all duration-200 ${
                activeFile?.id === file.id 
                  ? 'bg-gray-800/90 shadow-lg' 
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <File size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">{file.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                }}
                className="p-1 rounded hover:bg-gray-700 text-gray-400"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Editor Header - Responsive version */}
        <div className="px-2 md:px-4 py-2 md:py-3 border-b border-gray-800/50 bg-gray-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
              {!isMobile && (
                <h2 className="text-gray-200 font-medium">
                  {activeFile ? activeFile.name : 'No file selected'}
                </h2>
              )}
              {saveStatus && (
                <span className="text-xs text-gray-400 animate-fade-in whitespace-nowrap">
                  {saveStatus}
                </span>
              )}
              {activeFile && (
                <div className="flex items-center gap-1 md:gap-2">
                  <ActionButton 
                    icon={Copy} 
                    label={isMobile ? '' : "Copy"}
                    onClick={() => navigator.clipboard.writeText(currentContent)}
                  />
                  <ActionButton 
                    icon={Download} 
                    label={isMobile ? '' : "Download"}
                    onClick={() => downloadCode(currentContent, activeFile.name)}
                  />
                  <ActionButton 
                    icon={Play} 
                    label={isMobile ? '' : (isLoading ? 'Running...' : 'Run')}
                    variant="primary"
                    onClick={handleRunCode}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {!isMobile && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={autoExecute}
                        onChange={(e) => setAutoExecute(e.target.checked)}
                        className="rounded border-gray-600"
                      />
                      Auto-run
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Font Size:</span>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-24 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-xs text-gray-400">{fontSize}px</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Editor and Output - Responsive */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative min-h-0" ref={containerRef}>
            {activeFile ? (
              <div className="absolute inset-0 p-2">
                <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-800/50">
                  <Editor
                    height="100%"
                    defaultLanguage={activeFile.name.endsWith('.java') ? 'java' : 'javascript'}
                    theme="vs-dark"
                    value={activeFile.content}
                    onChange={handleFileChange}
                    onMount={handleEditorDidMount}
                    options={editorOptions}
                    className="rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center space-y-3">
                  <File size={40} className="mx-auto text-gray-500/50" />
                  <div className="text-lg font-medium">No File Selected</div>
                  <div className="text-sm text-gray-500">
                    Select an existing file or create a new one to start coding
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Terminal - Responsive */}
          {activeFile && (
            <>
              {/* Add InputSection here, before the output terminal */}
              <InputSection />
              <div className="h-32 md:h-48 border-t border-gray-800/50 bg-gray-950/90">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/30">
                  <span className="text-xs font-medium text-gray-400">Output Terminal</span>
                  {output && <ActionButton icon={Copy} label="Copy" onClick={() => navigator.clipboard.writeText(output)} />}
                </div>
                <div className="p-4 font-mono text-sm h-36 overflow-auto">
                  {error ? (
                    <span className="text-red-400">{error}</span>
                  ) : output ? (
                    <span className="text-green-400 whitespace-pre-wrap">{output}</span>
                  ) : (
                    <span className="text-gray-500">Run your code to see the output here...</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Responsive Modals */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 p-4 md:p-6 rounded-xl w-full max-w-sm md:max-w-md">
            <h3 className="text-gray-200 mb-4">Create New File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.java"
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-gray-200"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowNewFileDialog(false)}
                className="px-4 py-2 rounded bg-gray-700 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showInputModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 p-4 md:p-6 rounded-xl w-full max-w-sm md:max-w-md">
            <h3 className="text-gray-200 mb-4">Program Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter program input..."
              className="w-full h-32 bg-gray-700 rounded border border-gray-600 p-2 text-gray-200"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowInputModal(false)}
                className="px-4 py-2 rounded bg-gray-700 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const currentContent = latestContentRef.current || activeFile.content;
                  executeCode(
                    currentContent,
                    activeFile.name.endsWith('.java') ? 'java' : 'javascript'
                  );
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Run with Input
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CodingArea);
