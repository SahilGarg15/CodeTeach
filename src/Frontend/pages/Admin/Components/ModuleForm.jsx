import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ModuleForm = ({ courseId, existingModules = [], onSave, onCancel }) => {
  const [modules, setModules] = useState(existingModules.length > 0 ? existingModules : [{
    moduleId: '',
    title: '',
    description: '',
    order: 1,
    topics: []
  }]);
  
  const [expandedModules, setExpandedModules] = useState([0]);

  const addModule = () => {
    setModules([...modules, {
      moduleId: `module_${Date.now()}`,
      title: '',
      description: '',
      order: modules.length + 1,
      topics: []
    }]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const updateModule = (index, field, value) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const addTopicToModule = (moduleIndex) => {
    const newModules = [...modules];
    if (!newModules[moduleIndex].topics) {
      newModules[moduleIndex].topics = [];
    }
    newModules[moduleIndex].topics.push({
      topicId: `topic_${Date.now()}`,
      title: '',
      description: '',
      order: newModules[moduleIndex].topics.length + 1,
      componentPath: '',
      estimatedTime: '',
      hasPractice: false
    });
    setModules(newModules);
  };

  const removeTopicFromModule = (moduleIndex, topicIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter((_, i) => i !== topicIndex);
    setModules(newModules);
  };

  const updateTopic = (moduleIndex, topicIndex, field, value) => {
    const newModules = [...modules];
    newModules[moduleIndex].topics[topicIndex][field] = value;
    setModules(newModules);
  };

  const toggleModuleExpand = (index) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter(i => i !== index));
    } else {
      setExpandedModules([...expandedModules, index]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(modules);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-4xl my-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Course Modules
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            <AnimatePresence>
              {modules.map((module, moduleIndex) => (
                <motion.div
                  key={moduleIndex}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                >
                  {/* Module Header */}
                  <div className="flex justify-between items-start mb-3">
                    <button
                      type="button"
                      onClick={() => toggleModuleExpand(moduleIndex)}
                      className="flex items-center space-x-2 flex-1"
                    >
                      {expandedModules.includes(moduleIndex) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                      <span className="font-semibold text-lg">
                        Module {moduleIndex + 1}: {module.title || 'New Module'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {expandedModules.includes(moduleIndex) && (
                    <div className="space-y-4 mt-4">
                      {/* Module Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Module ID</label>
                          <input
                            type="text"
                            value={module.moduleId}
                            onChange={(e) => updateModule(moduleIndex, 'moduleId', e.target.value)}
                            placeholder="e.g., intro-to-java"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Module Title</label>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                            placeholder="e.g., Introduction to Java"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={module.description}
                          onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                          placeholder="Module description..."
                          rows="2"
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>

                      {/* Topics Section */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold">Topics</h4>
                          <button
                            type="button"
                            onClick={() => addTopicToModule(moduleIndex)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center space-x-1 text-sm"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Topic</span>
                          </button>
                        </div>

                        {module.topics && module.topics.length > 0 ? (
                          <div className="space-y-3">
                            {module.topics.map((topic, topicIndex) => (
                              <div
                                key={topicIndex}
                                className="bg-white dark:bg-gray-800 p-3 rounded-lg border"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium text-sm">Topic {topicIndex + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTopicFromModule(moduleIndex, topicIndex)}
                                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Topic ID</label>
                                    <input
                                      type="text"
                                      value={topic.topicId}
                                      onChange={(e) => updateTopic(moduleIndex, topicIndex, 'topicId', e.target.value)}
                                      placeholder="topic-id"
                                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Title</label>
                                    <input
                                      type="text"
                                      value={topic.title}
                                      onChange={(e) => updateTopic(moduleIndex, topicIndex, 'title', e.target.value)}
                                      placeholder="Topic Title"
                                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Component Path</label>
                                    <input
                                      type="text"
                                      value={topic.componentPath}
                                      onChange={(e) => updateTopic(moduleIndex, topicIndex, 'componentPath', e.target.value)}
                                      placeholder="src/components/..."
                                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">Estimated Time</label>
                                    <input
                                      type="text"
                                      value={topic.estimatedTime}
                                      onChange={(e) => updateTopic(moduleIndex, topicIndex, 'estimatedTime', e.target.value)}
                                      placeholder="30 mins"
                                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700"
                                    />
                                  </div>
                                </div>

                                <div className="mt-2">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={topic.hasPractice}
                                      onChange={(e) => updateTopic(moduleIndex, topicIndex, 'hasPractice', e.target.checked)}
                                      className="rounded"
                                    />
                                    <span className="text-sm">Has Practice Exercise</span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">No topics yet</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={addModule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Module</span>
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Save Modules
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ModuleForm;
