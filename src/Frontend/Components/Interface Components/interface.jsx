import React, { useState, useEffect, useCallback, memo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, ChevronDown, ArrowRight, Code, ArrowLeft } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import CodingArea from './codingarea';  // Add this import
import { motion, AnimatePresence } from 'framer-motion'; // Add this import
import config from '../../../config/config';  // Default import
import { apiRequest } from '../../../config/config';  // Named import
import Header from '../Header'; // Add Header import
// Internal ModuleButton component
const ModuleButton = ({ module, isExpanded, toggleModule, completedModules }) => {
  const allSubModulesCompleted = module.subModules.every(
    sub => completedModules.has(`${module.id}.${sub.id}`)
  );

  return (
    <button
      onClick={() => toggleModule(module.id)}
      className={`w-full px-4 py-3 rounded-xl transition-colors duration-200 
        border group/module flex items-center justify-between
        ${isExpanded ? 'bg-gray-800/50 border-gray-700/50' : 'border-transparent hover:bg-white/[0.02]'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full transition-colors duration-200
          ${allSubModulesCompleted ? 'bg-green-400' : 
            isExpanded ? 'bg-sky-400' : 'bg-gray-500 group-hover/module:bg-gray-400'}`} />
        <span className={`text-sm font-medium transition-colors duration-200
          ${allSubModulesCompleted ? 'text-green-400' :
            isExpanded ? 'text-sky-400' : 'text-gray-400 group-hover/module:text-gray-300'}`}>
          {module.title}
        </span>
      </div>
      <ChevronDown size={16} 
        className={`text-gray-500 transition-transform duration-200
          ${isExpanded ? 'rotate-180 text-sky-400' : 'rotate-0 group-hover/module:text-gray-400'}`} 
      />
    </button>
  );
};

// Internal LoadingSpinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

// Internal ErrorBoundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h1>Something went wrong</h1>
          <p>Failed to load the module content.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Add NextButton component inside CourseLayout
const NextButton = memo(({ nextModule, onNext }) => {
  if (!nextModule) return null;

  return (
    <button
      onClick={() => onNext(nextModule.moduleId, nextModule.id)}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg
        bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20
        text-blue-400 transition-all duration-200"
    >
      <span>Next: {nextModule.title}</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
});

// Add this new component before CourseLayout
const WelcomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  return (
    <div className="text-center p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-100">Welcome to Interactive Learning!</h1>
      <p className="text-gray-300 text-lg">Let's start your coding journey together.</p>
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
        {isMobile ? (
          <p className="text-gray-300">
               Swipe left to start learning, or use the menu button in the top-left corner to explore topics
          </p>
        ) : (
          <p className="text-gray-300">
            ➡️ Press the right arrow key to begin, or explore topics from the sidebar
          </p>
        )}
      </div>
    </div>
  );
};

const NotFoundPage = () => (
  <div className="text-center py-16">
    <h1 className="text-3xl font-bold text-gray-100 mb-4">Topic Not Found</h1>
    <p className="text-gray-400 mb-8">The requested topic could not be found.</p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Ensure CourseLayout component renders modals outside the main layout
const CourseLayout = ({ 
  courseName, 
  courseShortName, 
  modules, 
  basePath = "" 
}) => {
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isMenuOpen, setIsMenuOpen] = useState(!isMobile);
  const [expandedModules, setExpandedModules] = useState({});
  const [activeModule, setActiveModule] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [lastVisitedModule, setLastVisitedModule] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    modules.forEach((module) => {
      module.subModules.forEach((subModule) => {
        if (currentPath.includes(subModule.id)) {
          setExpandedModules((prev) => ({ ...prev, [module.id]: true }));
        }
      });
    });
  }, [location, modules]);

  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split('/');
    const moduleId = pathParts[pathParts.length - 2];
    const subModuleId = pathParts[pathParts.length - 1];
    if (moduleId && subModuleId) {
      setActiveModule(`${moduleId}.${subModuleId}`);
      setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
    }
  }, [location.pathname]);
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const navigateToContent = useCallback((moduleId, subModuleId) => {
    // Reset scroll position before navigation
    const contentArea = document.querySelector('.content-scroll-area');
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
    
    setActiveModule(`${moduleId}.${subModuleId}`);
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
    if (isMobile) {
      setIsMenuOpen(false);
    }
    navigate(`${basePath}/${moduleId}/${subModuleId}`);
  }, [navigate, isMobile, basePath]);

  const toggleSidebar = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const findNextModule = useCallback((currentModuleId, currentSubModuleId) => {
    const flatModules = modules.flatMap(module => 
      module.subModules.map(subModule => ({
        ...subModule,
        moduleId: module.id
      }))
    );
    
    const currentIndex = flatModules.findIndex(
      m => m.moduleId === currentModuleId && m.id === currentSubModuleId
    );
    
    return flatModules[currentIndex + 1];
  }, [modules]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .writing-mode-vertical {
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }
      
      * {
        scrollbar-width: thin;
        scrollbar-color: rgb(31 41 55) transparent;
      }

      .sidebar-transition {
        will-change: transform, opacity, width;
      }

      .content-scroll-area {
        will-change: scroll-position;
      }

      .module-container {
        min-height: 48px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const smoothScroll = useCallback((direction) => {
    const contentArea = document.querySelector('.content-scroll-area');
    if (!contentArea) return;

    const scrollAmount = window.innerHeight * 0.75;
    const currentScroll = contentArea.scrollTop;
    const targetScroll = direction === 'up' ? 
      currentScroll - scrollAmount : 
      currentScroll + scrollAmount;

    contentArea.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  const navigateModules = useCallback((direction) => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    const currentModuleId = pathParts[pathParts.length - 2];
    const currentSubModuleId = pathParts[pathParts.length - 1];

    const flatModules = modules.flatMap(module => 
      module.subModules.map(subModule => ({
        ...subModule,
        moduleId: module.id
      }))
    );
    
    const currentIndex = flatModules.findIndex(
      m => m.moduleId === currentModuleId && m.id === currentSubModuleId
    );

    const targetIndex = direction === 'next' ? 
      currentIndex + 1 : 
      currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < flatModules.length) {
      setSwipeDirection(direction === 'next' ? 'left' : 'right');
      const targetModule = flatModules[targetIndex];
      navigateToContent(targetModule.moduleId, targetModule.id);
    }
  }, [location.pathname, navigateToContent, modules]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          smoothScroll('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          smoothScroll('up');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateModules('next');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateModules('prev');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [smoothScroll, navigateModules]);

  const toggleEditor = useCallback(() => {
    setIsEditorOpen(prev => !prev);
  }, []);

  // Add touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(null);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSwipeDirection('left'); // Changed from 'right' to 'left'
      navigateModules('next');
    } else if (isRightSwipe) {
      setSwipeDirection('right'); // Changed from 'left' to 'right'
      navigateModules('prev');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const extractCourseId = useCallback((pathname) => {
    // Match course ID from path pattern /course/:courseId/modules/...
    const match = pathname.match(/\/course\/([^/]+)\/modules/);
    if (match) {
      return match[1];
    }
  
    // If no match found, try to extract from basePath
    const basePathMatch = basePath.match(/\/course\/([^/]+)/);
    if (basePathMatch) {
      return basePathMatch[1];
    }
  
    console.error('Could not extract course ID from paths:', { pathname, basePath });
    return null;
  }, [basePath]);

  // Add this function to mark a module as complete
  // const markModuleAsComplete = useCallback(async (moduleId, subModuleId) => {
  //   try {
  //     const courseId = extractCourseId(location.pathname);
  
  //     if (!courseId) return;
  
  //     console.log('Progress update:', {
  //       courseId,
  //       moduleId,
  //       subModuleId,
  //       timestamp: new Date().toISOString()
  //     });
  
  //     const response = await apiRequest(config.api.endpoints.courses.progress(courseId), {
  //       method: 'PUT',
  //       body: JSON.stringify({
  //         moduleId,
  //         subModuleId,
  //         modules: modules
  //       })
  //     });
  
  //     console.log('Progress updated successfully:', {
  //       completedModules: response.completedModules,
  //       progress: response.progress
  //     });

  //     setCompletedModules(prev => new Set([...prev, `${moduleId}.${subModuleId}`]));
  
  //   } catch (error) {
  //     console.error('Progress update failed:', error.message);
  //   }
  // }, [location.pathname, modules, extractCourseId]);

  // Add progress to NextButton component
  const NextButton = memo(({ nextModule, onNext }) => {
    if (!nextModule) return null;

    const handleNext = async () => {
      const pathParts = location.pathname.split('/');
      const currentModuleId = pathParts[pathParts.length - 2];
      const currentSubModuleId = pathParts[pathParts.length - 1];

      // Mark current module as complete before moving to next
      // await markModuleAsComplete(currentModuleId, currentSubModuleId);
      
      // Navigate to next module
      onNext(nextModule.moduleId, nextModule.id);
    };

    return (
      <button
        onClick={handleNext}
        className="group flex items-center gap-2 px-4 py-2 rounded-lg
          bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20
          text-blue-400 transition-all duration-200"
      >
        <span>Next: {nextModule.title}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  });
  // Add this debug logging
  useEffect(() => {
    console.log('CourseLayout mounted:', {
      pathname: location.pathname,
      basePath,
      modules: modules.length
    });
  }, [location.pathname, basePath, modules]);

  // Add path validation
  const isValidPath = useCallback(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    const lastTwo = parts.slice(-2);
    
    if (lastTwo.length !== 2) return false;
    
    const [moduleId, subModuleId] = lastTwo;
    const moduleExists = modules.some(m => 
      m.id === moduleId && m.subModules.some(s => s.id === subModuleId)
    );
    
    return moduleExists;
  }, [location.pathname, modules]);

  // Add this validation function
  const validatePath = useCallback(() => {
    const path = location.pathname;
    const modulePath = path.replace(basePath, '').split('/').filter(Boolean);
    if (modulePath.length !== 2) return false;

    const [moduleId, subModuleId] = modulePath;
    const module = modules.find(m => m.id === moduleId);
    const subModule = module?.subModules.find(s => s.id === subModuleId);
    
    return !!subModule;
  }, [location.pathname, basePath, modules]);

  useEffect(() => {
    const isValid = validatePath();
    console.log('Path validation result:', { 
      path: location.pathname, 
      isValid 
    });
  }, [location.pathname, validatePath]);

  // // Remove all scroll-related useEffects and replace with timer-based completion
  // useEffect(() => {
  //   let completionTimer;
    
  //   const startCompletionTimer = () => {
  //     // Clear any existing timer
  //     if (completionTimer) {
  //       clearTimeout(completionTimer);
  //     }

  //     // Don't start timer if already marked complete
  //     if (hasMarkedComplete) return;

  //     const pathParts = location.pathname.split('/');
  //     const currentModuleId = pathParts[pathParts.length - 2];
  //     const currentSubModuleId = pathParts[pathParts.length - 1];

  //     // Only start timer if we're on a valid module page
  //     if (currentModuleId && currentSubModuleId) {
  //       console.log('Starting 5-second completion timer for:', {
  //         moduleId: currentModuleId,
  //         subModuleId: currentSubModuleId
  //       });

  //       completionTimer = setTimeout(() => {
  //         console.log('Module completion timer finished');
  //         markModuleAsComplete(currentModuleId, currentSubModuleId);
  //         setHasMarkedComplete(true);
  //       }, 5000); // 5 seconds
  //     }
  //   };

  //   // Start timer when route changes
  //   startCompletionTimer();

  //   // Cleanup function
  //   return () => {
  //     if (completionTimer) {
  //       clearTimeout(completionTimer);
  //     }
  //   };
  // }, [location.pathname, markModuleAsComplete, hasMarkedComplete]);

  // // Reset completion state when route changes
  // useEffect(() => {
  //   setHasMarkedComplete(false);
  // }, [location.pathname]);

  // // Add effect to load completion status and last visited module
  // useEffect(() => {
  //   const fetchProgress = async () => {
  //     try {
  //       const courseId = extractCourseId(location.pathname);
  //       if (!courseId) return;

  //       const response = await apiRequest(config.api.endpoints.courses.progress(courseId), {
  //         method: 'GET'
  //       });

  //       // Update completed modules
  //       if (response.completedModules) {
  //         setCompletedModules(new Set(response.completedModules));
  //       }

  //       // Set last visited module
  //       if (response.lastVisited) {
  //         setLastVisitedModule(response.lastVisited);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching progress:', error);
  //     }
  //   };

  //   fetchProgress();
  // }, [location.pathname, extractCourseId]);

  // Modify the initial route logic to start from last visited module
  useEffect(() => {
    const path = location.pathname;
    if (path === basePath && lastVisitedModule) {
      const { moduleId, subModuleId } = lastVisitedModule;
      navigateToContent(moduleId, subModuleId);
    }
  }, [lastVisitedModule, location.pathname, basePath, navigateToContent]);

  // Update the submodule button rendering in the sidebar
  const renderSubModuleButton = (module, subModule) => (
    <button
      key={subModule.id}
      onClick={() => navigateToContent(module.id, subModule.id)}
      className={`group w-full px-4 py-3 rounded-xl transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-sky-500/20
        ${activeModule === `${module.id}.${subModule.id}`
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
          : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 border-transparent'
        } border`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            completedModules.has(`${module.id}.${subModule.id}`) 
              ? 'bg-green-400' 
              : 'bg-current opacity-60'
          }`}></div>
          <span className="text-sm">{subModule.title}</span>
        </div>
        {completedModules.has(`${module.id}.${subModule.id}`) && (
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .page-transition {
        contain: content;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform, opacity;
      }
      
      .content-scroll-area {
        contain: content;
        transform: translateZ(0);
        backface-visibility: hidden;
        -webkit-overflow-scrolling: touch;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .page-transition {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    let rafId;
    const cleanup = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
    window.addEventListener('visibilitychange', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('visibilitychange', cleanup);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row h-screen bg-gray-950 overflow-hidden pt-16">
        {/* Remove the left-side menu button */}
        <div 
          className={`fixed md:relative z-40 h-full sidebar-transition
            ${isMenuOpen ? 'w-[280px] md:w-[320px] translate-x-0' : 'w-[60px] -translate-x-full md:translate-x-0'}
            bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 group flex flex-col`}
          style={{ 
            willChange: 'transform, width',
            backfaceVisibility: 'hidden'
          }}
        >
          
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`absolute top-1/2 -right-4 z-50 p-2 rounded-full 
                bg-gray-800/90 border border-gray-700/50 text-gray-400 shadow-lg
                hover:text-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100
                transform -translate-y-1/2 hover:scale-110 focus:outline-none
                hover:bg-gray-700/90 backdrop-blur-xl`}
              title="Toggle Menu (Ctrl+M)"
            >
              <ChevronRight size={16} className={`transform transition-transform duration-200
                ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
          )}

          <div className={`${isMenuOpen ? 'opacity-0' : 'opacity-100'} 
            transition-opacity duration-200 h-full flex flex-col items-center py-6`}>
            <div className="flex flex-col items-center gap-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                flex items-center justify-center border border-gray-700/50">
                <span className="text-lg font-semibold text-gray-300">{courseShortName}</span>
              </div>
              <div className="h-20 w-px bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent"/>
            </div>
            <span className="writing-mode-vertical text-xs font-medium text-gray-400
              tracking-wider uppercase rotate-180 mt-4">{courseName}</span>
          </div>

          <div className={`${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'} 
            transition-all duration-200 h-full overflow-hidden absolute inset-0 bg-gray-900/95 flex flex-col`}>
            <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                  flex items-center justify-center border border-gray-700/50">
                  <span className="text-sm font-semibold text-gray-300">{courseShortName}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-200">{courseName}</h2>
                  <p className="text-xs text-gray-400">Master Programming</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {modules.map((module) => (
                  <div key={module.id} className="group">
                    <ModuleButton 
                      module={module}
                      isExpanded={expandedModules[module.id]}
                      toggleModule={toggleModule}
                      completedModules={completedModules}
                    />

                    {expandedModules[module.id] && (
                      <div className="relative mt-2 ml-4 pl-4 py-2 animate-slideDown">
                        <div className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-blue-500/30 via-slate-700/20 to-transparent"></div>
                        {module.subModules.map((subModule) => (
                          renderSubModuleButton(module, subModule)
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isMobile && isMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={toggleSidebar}
            style={{ willChange: 'opacity' }}
            aria-hidden="true"
          />
        )}

        <div 
          className={`flex-1 relative transition-opacity duration-200
            ${isMobile && isMenuOpen ? 'opacity-50' : 'opacity-100'}`}
          style={{ willChange: 'opacity' }}
        >
          <div className="absolute inset-0 flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <div className="sticky top-0 z-10 px-4 sm:px-6 py-3 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate('/learning-dashboard')}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800/50 
                      text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 
                      transition-colors duration-200 border border-gray-700/50 text-sm"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <span className="text-gray-300 font-medium text-sm">{courseShortName}</span>
                  <svg className="w-3 h-3 text-slate-600 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {modules.map(m => m.subModules.find(s => `${m.id}.${s.id}` === activeModule))
                    .filter(Boolean)
                    .map(subModule => (
                      <span key={subModule.id} 
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-200 border border-gray-700/50">
                        {subModule.title}
                      </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <button
                      onClick={toggleEditor}
                      className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-gray-100 
                        hover:bg-gray-700/50 transition-colors duration-200 border border-gray-700/50"
                      title="Open Code Editor"
                    >
                      <Code size={20} />
                    </button>
                  )}
                  {isMobile && (
                    <button
                      onClick={toggleSidebar}
                      className="p-2 rounded-lg bg-gray-800/50 text-gray-400 
                        hover:text-gray-200 transition-colors duration-200 
                        border border-gray-700/50"
                      title="Toggle Menu"
                    >
                      <Menu size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isEditorOpen ? (
              <CodingArea onClose={toggleEditor} />
            ) : (
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: swipeDirection === 'left' ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: swipeDirection === 'left' ? -100 : 100 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="h-full overflow-y-auto content-scroll-area"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-6xl mx-auto">
                      <Routes>
                        <Route index element={<WelcomePage />} />
                        {modules.map((module) =>
                          module.subModules.map((subModule) => (
                            <Route
                              key={`${module.id}-${subModule.id}`}
                              path={`/${module.id}/${subModule.id}`}
                              element={
                                <ErrorBoundary>
                                  <React.Suspense fallback={<LoadingSpinner />}>
                                    <>
                                      <subModule.component />
                                      <div className="mt-8 flex justify-end">
                                        <Routes>
                                          <Route
                                            path="*"
                                            element={
                                              <NextButton 
                                                nextModule={findNextModule(module.id, subModule.id)} 
                                                onNext={navigateToContent}
                                              />
                                            }
                                          />
                                        </Routes>
                                      </div>
                                    </>
                                  </React.Suspense>
                                </ErrorBoundary>
                              }
                            />
                          ))
                        )}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Portal container for modals */}
      <div id="modal-root" className="relative z-[100]">
        {/* Any modals from child components will be rendered here */}
      </div>
    </>
  );
};
export default memo(CourseLayout);