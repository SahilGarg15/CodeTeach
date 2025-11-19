import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Menu, X, LogOut, ChevronDown, BookOpen, Shield, Award, MessageSquare, ClipboardList, FileText, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
// Memoize menu items to prevent unnecessary re-renders
const MENU_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

// Animation variants to reduce repetition
const headerVariants = {
  initial: { y: -100 },
  animate: { 
    y: 0, 
    transition: { type: 'spring', stiffness: 100 }
  }
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { delay: 0.2 }
  }
};

const menuItemVariants = {
  initial: { opacity: 0, y: -20 },
  animate: (index) => ({
    opacity: 1, 
    y: 0,
    transition: { delay: 0.3 + index * 0.1 }
  })
};

// Memoize individual menu item component
const MenuItem = memo(({ item, isActive, onClick }) => (
  <motion.li
    custom={item.index}
    variants={menuItemVariants}
    initial="initial"
    animate="animate"
  >
    <Link
      to={item.href}
      className={`text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative group ${
        isActive ? 'text-purple-600 dark:text-purple-400 font-semibold' : ''
      }`}
      onClick={onClick}
    >
      {item.name}
      <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 dark:bg-purple-400 transform ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      } transition-transform duration-200 origin-left`}></span>
    </Link>
  </motion.li>
));

const Header = memo(() => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Check if we're on a course page
  const isCoursePage = location.pathname.startsWith('/course/');

  // Course navigation items
  const courseNavItems = courseId ? [
    { path: `/course/${courseId}/modules`, icon: BookOpen, label: 'Modules' },
    { path: `/course/${courseId}/discussions`, icon: MessageSquare, label: 'Discussions' },
    { path: `/course/${courseId}/quizzes`, icon: ClipboardList, label: 'Quizzes' },
    { path: `/course/${courseId}/assignments`, icon: FileText, label: 'Assignments' },
    { path: `/course/${courseId}/reviews`, icon: Star, label: 'Reviews' },
  ] : [];

  // Use useCallback to memoize theme toggle function
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Optimize initial mount effect
  useEffect(() => {
    setMounted(true);
  }, []); // Empty dependency array ensures this runs only once

  // Cleanup effect for event listeners
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize handlers
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Early return if not mounted to prevent unnecessary renders
  if (!mounted) return null;

  return (
    <motion.header 
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo */}
          <div className="w-[200px] flex items-center">
            <motion.div 
              variants={itemVariants}
              initial="initial"
              animate="animate"
            >
              <Link 
                to="/" 
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 hover:opacity-80 transition-opacity duration-200"
              >
                CodeTeach
              </Link>
            </motion.div>
          </div>

          {/* Center section - Navigation */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden md:block">
              <ul className="flex space-x-1">
                {isCoursePage ? (
                  // Show course navigation when on course page
                  courseNavItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <motion.li
                        key={item.path}
                        custom={index}
                        variants={menuItemVariants}
                        initial="initial"
                        animate="animate"
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative group ${
                            isActive 
                              ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                              : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                          <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 dark:bg-purple-400 transform ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          } transition-transform duration-200 origin-left`}></span>
                        </Link>
                      </motion.li>
                    );
                  })
                ) : (
                  // Show regular navigation when not on course page
                  MENU_ITEMS.map((item, index) => (
                    <MenuItem
                      key={item.name}
                      item={{ ...item, index }}
                      isActive={location.pathname === item.href}
                      onClick={() => setIsMenuOpen(false)}
                    />
                  ))
                )}
              </ul>
            </nav>
          </div>

          {/* Right section - Actions */}
          <div className="w-[200px] flex items-center justify-end space-x-2 sm:space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 transition-colors duration-200 hover:bg-purple-200 dark:hover:bg-purple-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {user && <NotificationCenter />}

            {user ? (
              <div className="relative user-dropdown">
                <motion.div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.email}
                        </p>
                        {(user.role === 'admin' || user.isAdmin) && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      {(user.role === 'admin' || user.isAdmin) && (
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 font-medium"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          navigate('/learning-dashboard');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learning Dashboard
                      </button>

                      <button
                        onClick={() => {
                          navigate('/my-certificates');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        My Certificates
                      </button>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth">
                <motion.button
                  className="h-10 px-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            <motion.button
              className="md:hidden p-2 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 transition-colors duration-200 hover:bg-purple-200 dark:hover:bg-purple-700"
              onClick={handleMenuToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-2">
                {isCoursePage ? (
                  // Show course navigation in mobile menu when on course page
                  courseNavItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2 ${
                            isActive 
                              ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 font-semibold' 
                              : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                          } px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-purple-50 dark:hover:bg-purple-900`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })
                ) : (
                  // Show regular menu items when not on course page
                  MENU_ITEMS.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        to={item.href}
                        className={`block ${
                          location.pathname === item.href 
                            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 font-semibold' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                        } px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-purple-50 dark:hover:bg-purple-900`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

export default Header;