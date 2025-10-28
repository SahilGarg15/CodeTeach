import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, LineChart, Settings, LogOut, Plus, Edit, Trash2, Menu, X } from 'lucide-react';
import config from '../../../config/config';
import UsersComponent from './Components/Users';
import CoursesComponent from './Components/Courses';
import ModuleForm from './Components/ModuleForm';
import Header from '../../Components/Header';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    price: '',
    image: ''
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [managingModules, setManagingModules] = useState(null);
  const [settingsTab, setSettingsTab] = useState('general');
  const [settingsForm, setSettingsForm] = useState({
    // General Settings
    siteName: 'Code Teach',
    siteDescription: 'Learn programming with interactive tutorials',
    siteUrl: 'https://codeteach.com',
    contactEmail: 'support@codeteach.com',
    supportEmail: 'help@codeteach.com',
    adminEmail: 'admin@codeteach.com',
    
    // Registration & Auth
    enableRegistration: true,
    requireEmailVerification: true,
    allowSocialLogin: true,
    passwordMinLength: 8,
    sessionTimeout: 30, // minutes
    
    // Email Settings
    enableEmailNotifications: true,
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFromName: 'Code Teach',
    emailFromAddress: 'noreply@codeteach.com',
    
    // Course Settings
    defaultCourseVisibility: 'public',
    allowUserCourseCreation: false,
    requireCourseApproval: true,
    maxCoursesPerUser: 10,
    enableCourseRatings: true,
    enableCourseComments: true,
    
    // System Settings
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
    debugMode: false,
    logLevel: 'error',
    backupFrequency: 'daily',
    
    // Security Settings
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    enableIPWhitelist: false,
    allowedIPs: [],
    
    // Performance Settings
    cacheEnabled: true,
    cacheDuration: 3600, // seconds
    maxUploadSize: 10, // MB
    enableCDN: false,
    cdnUrl: '',
    
    // Notification Settings
    enableInAppNotifications: true,
    enablePushNotifications: false,
    enableSMSNotifications: false,
    notificationFrequency: 'immediate',
    
    // Analytics Settings
    enableAnalytics: true,
    analyticsProvider: 'google',
    googleAnalyticsId: '',
    trackUserBehavior: true,
    
    // Content Settings
    defaultLanguage: 'en',
    enableMultiLanguage: false,
    supportedLanguages: ['en'],
    moderateComments: true,
    allowAnonymousComments: false,
    
    // Payment Settings (if applicable)
    enablePayments: false,
    paymentProvider: 'stripe',
    stripePublicKey: '',
    stripeSecretKey: '',
    currency: 'USD',
    taxRate: 0
  });

  // Check admin session only once on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token || (user.role !== 'admin' && !user.isAdmin)) {
      console.log('Not authorized - redirecting to auth');
      localStorage.clear();
      window.location.href = '/auth';
      return;
    }
  }, []); // Only run once on mount

  // Fetch admin data only once on mount
  useEffect(() => {
    fetchAdminData();
  }, []); // Only run once on mount

  // Fetch users when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]); // Only run when activeTab changes

  const fetchAdminData = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Not authorized');
      }

      const result = await response.json();
      console.log('Admin stats response:', result);
      console.log('Overview:', result.data?.overview);
      console.log('Recent users:', result.data?.recentUsers);
      console.log('Popular courses:', result.data?.popularCourses);
      
      // Backend returns: { success: true, data: { overview: {...}, recentUsers: [...], popularCourses: [...] } }
      if (result.success && result.data) {
        console.log('Setting stats to:', result.data.overview);
        setStats(result.data.overview || {});
        setUsers(result.data.recentUsers || []);
        setCourses(result.data.popularCourses || []);
      } else {
        console.warn('Invalid response structure:', result);
      }
    } catch (error) {
      console.error('Admin fetch error:', error);
      // Don't redirect on error, just show empty state
      setStats({});
      setUsers([]);
      setCourses([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      console.log('Fetched users:', result);
      
      // Backend returns { success: true, data: [...], count, total, page, pages }
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setUsers([]);
    }
  };

  const handleLogout = () => {
    // Clear all session data
    localStorage.clear();
    // Force navigation to auth page
    window.location.href = '/auth';
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseForm)
      });

      if (!response.ok) throw new Error('Failed to add course');
      
      fetchAdminData();
      setShowAddCourse(false);
      setCourseForm({
        title: '',
        description: '',
        category: '',
        duration: '',
        price: '',
        image: ''
      });
    } catch (error) {
      console.error('Add course error:', error);
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseForm)
      });

      if (!response.ok) throw new Error('Failed to update course');
      
      fetchAdminData();
      setEditingCourse(null);
      setCourseForm({
        title: '',
        description: '',
        category: '',
        duration: '',
        price: '',
        image: ''
      });
    } catch (error) {
      console.error('Edit course error:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete course');
      
      
      fetchAdminData();
    } catch (error) {
      console.error('Delete course error:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      // Remove user from state
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Delete user error:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleManageModules = (course) => {
    setManagingModules(course);
  };

  const handleSaveModules = async (modules) => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/admin/courses/${managingModules._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modules })
      });

      if (!response.ok) throw new Error('Failed to update modules');

      alert('Modules updated successfully!');
      setManagingModules(null);
      fetchAdminData();
    } catch (error) {
      console.error('Update modules error:', error);
      alert('Failed to update modules');
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Validate required fields
      if (!settingsForm.siteName.trim()) {
        alert('Site name is required');
        return;
      }

      // TODO: Once backend endpoint is ready, uncomment this:
      // const response = await fetch(`${config.api.baseUrl}/api/admin/settings`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(settingsForm)
      // });
      // 
      // if (!response.ok) throw new Error('Failed to save settings');
      // const data = await response.json();

      // For now, save to localStorage
      localStorage.setItem('siteSettings', JSON.stringify(settingsForm));
      
      alert('✅ All settings saved successfully! Changes will take effect immediately.');
    } catch (error) {
      console.error('Save settings error:', error);
      alert('❌ Failed to save settings: ' + error.message);
    }
  };

  const handleResetSettings = () => {
    if (!window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      return;
    }

    const defaultSettings = {
      // General Settings
      siteName: 'Code Teach',
      siteDescription: 'Learn programming with interactive tutorials',
      siteUrl: 'https://codeteach.com',
      contactEmail: 'support@codeteach.com',
      supportEmail: 'help@codeteach.com',
      adminEmail: 'admin@codeteach.com',
      
      // Registration & Auth
      enableRegistration: true,
      requireEmailVerification: true,
      allowSocialLogin: true,
      passwordMinLength: 8,
      sessionTimeout: 30,
      
      // Email Settings
      enableEmailNotifications: true,
      emailProvider: 'smtp',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      emailFromName: 'Code Teach',
      emailFromAddress: 'noreply@codeteach.com',
      
      // Course Settings
      defaultCourseVisibility: 'public',
      allowUserCourseCreation: false,
      requireCourseApproval: true,
      maxCoursesPerUser: 10,
      enableCourseRatings: true,
      enableCourseComments: true,
      
      // System Settings
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
      debugMode: false,
      logLevel: 'error',
      backupFrequency: 'daily',
      
      // Security Settings
      enableTwoFactor: false,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      enableIPWhitelist: false,
      allowedIPs: [],
      
      // Performance Settings
      cacheEnabled: true,
      cacheDuration: 3600,
      maxUploadSize: 10,
      enableCDN: false,
      cdnUrl: '',
      
      // Notification Settings
      enableInAppNotifications: true,
      enablePushNotifications: false,
      enableSMSNotifications: false,
      notificationFrequency: 'immediate',
      
      // Analytics Settings
      enableAnalytics: true,
      analyticsProvider: 'google',
      googleAnalyticsId: '',
      trackUserBehavior: true,
      
      // Content Settings
      defaultLanguage: 'en',
      enableMultiLanguage: false,
      supportedLanguages: ['en'],
      moderateComments: true,
      allowAnonymousComments: false,
      
      // Payment Settings
      enablePayments: false,
      paymentProvider: 'stripe',
      stripePublicKey: '',
      stripeSecretKey: '',
      currency: 'USD',
      taxRate: 0
    };

    setSettingsForm(defaultSettings);
    localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
    alert('Settings have been reset to default values');
  };

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        setSettingsForm(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LineChart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
        {/* Mobile Menu Button - Improved touch target */}
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden touch-manipulation"
        >
        {isSidebarOpen ? (
          <X className="h-7 w-7 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="h-7 w-7 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Improved mobile behavior */}
        <div className={`
          fixed top-0 left-0 z-40 w-[85vw] sm:w-64 h-screen transform transition-transform duration-300 ease-in-out
          md:translate-x-0 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
            
            {/* Add logout button at the bottom */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-6 py-4 mt-auto text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content - Enhanced responsive layout */}
        <div className="w-full md:ml-64 p-3 sm:p-4 md:p-6 lg:p-8 mt-16 md:mt-0">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white px-2">
                Dashboard Overview
              </h2>
              
              {/* Stats Grid - More responsive breakpoints */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-2">
                <StatCard
                  title="Total Users"
                  value={stats?.totalUsers || '0'}
                  icon={Users}
                />
                <StatCard
                  title="Total Courses"
                  value={stats?.totalCourses || '0'}
                  icon={BookOpen}
                />
              </div>

              {/* Activity Grid - Enhanced responsive layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 px-2">
                {/* Recent Users */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Users</h3>
                  <div className="space-y-4">
                    {users && users.length > 0 ? (
                      users.map(user => (
                        <div key={user._id} className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent users</p>
                    )}
                  </div>
                </div>

                {/* Recent Courses */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Courses</h3>
                  <div className="space-y-4">
                    {courses && courses.length > 0 ? (
                      courses.map(course => (
                        <div key={course._id} className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{course.category}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No courses available</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <UsersComponent 
              users={users} 
              handleDeleteUser={handleDeleteUser} 
            />
          )}

          {activeTab === 'courses' && (
            <CoursesComponent 
              courses={courses}
              showAddCourse={showAddCourse}
              setShowAddCourse={setShowAddCourse}
              editingCourse={editingCourse}
              setEditingCourse={setEditingCourse}
              courseForm={courseForm}
              setCourseForm={setCourseForm}
              handleEditCourse={handleEditCourse}
              handleAddCourse={handleAddCourse}
              handleDeleteCourse={handleDeleteCourse}
              onManageModules={handleManageModules}
            />
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  System Settings
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetSettings}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Save All Settings
                  </button>
                </div>
              </div>

              {/* Settings Navigation Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex overflow-x-auto">
                    {['general', 'email', 'security', 'courses', 'system', 'advanced'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSettingsTab(tab)}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                          settingsTab === tab
                            ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* General Settings */}
                  {settingsTab === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Site Name *
                            </label>
                            <input
                              type="text"
                              value={settingsForm.siteName}
                              onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="Your Site Name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Site URL
                            </label>
                            <input
                              type="url"
                              value={settingsForm.siteUrl}
                              onChange={(e) => setSettingsForm({ ...settingsForm, siteUrl: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://yoursite.com"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Site Description
                            </label>
                            <textarea
                              value={settingsForm.siteDescription}
                              onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="Brief description of your site"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Contact Email
                            </label>
                            <input
                              type="email"
                              value={settingsForm.contactEmail}
                              onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="contact@yoursite.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Support Email
                            </label>
                            <input
                              type="email"
                              value={settingsForm.supportEmail}
                              onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="support@yoursite.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Admin Email
                            </label>
                            <input
                              type="email"
                              value={settingsForm.adminEmail}
                              onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="admin@yoursite.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Registration & Authentication</h4>
                        <div className="space-y-4">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableRegistration}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableRegistration: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable User Registration
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Allow new users to create accounts
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.requireEmailVerification}
                              onChange={(e) => setSettingsForm({ ...settingsForm, requireEmailVerification: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Require Email Verification
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Users must verify email before accessing features
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.allowSocialLogin}
                              onChange={(e) => setSettingsForm({ ...settingsForm, allowSocialLogin: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Allow Social Login
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Enable login via Google, Facebook, etc.
                              </span>
                            </div>
                          </label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Minimum Password Length
                              </label>
                              <input
                                type="number"
                                min="6"
                                max="32"
                                value={settingsForm.passwordMinLength}
                                onChange={(e) => setSettingsForm({ ...settingsForm, passwordMinLength: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Session Timeout (minutes)
                              </label>
                              <input
                                type="number"
                                min="5"
                                max="1440"
                                value={settingsForm.sessionTimeout}
                                onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Settings */}
                  {settingsTab === 'email' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Configuration</h3>
                        
                        <div className="space-y-4 mb-6">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableEmailNotifications}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableEmailNotifications: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable Email Notifications
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Send automated emails to users
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Provider
                            </label>
                            <select
                              value={settingsForm.emailProvider}
                              onChange={(e) => setSettingsForm({ ...settingsForm, emailProvider: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                              <option value="smtp">SMTP</option>
                              <option value="sendgrid">SendGrid</option>
                              <option value="mailgun">Mailgun</option>
                              <option value="ses">Amazon SES</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              From Name
                            </label>
                            <input
                              type="text"
                              value={settingsForm.emailFromName}
                              onChange={(e) => setSettingsForm({ ...settingsForm, emailFromName: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="Your Company"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              From Email Address
                            </label>
                            <input
                              type="email"
                              value={settingsForm.emailFromAddress}
                              onChange={(e) => setSettingsForm({ ...settingsForm, emailFromAddress: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="noreply@yoursite.com"
                            />
                          </div>
                        </div>
                      </div>

                      {settingsForm.emailProvider === 'smtp' && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">SMTP Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                SMTP Host
                              </label>
                              <input
                                type="text"
                                value={settingsForm.smtpHost}
                                onChange={(e) => setSettingsForm({ ...settingsForm, smtpHost: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="smtp.gmail.com"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                SMTP Port
                              </label>
                              <input
                                type="number"
                                value={settingsForm.smtpPort}
                                onChange={(e) => setSettingsForm({ ...settingsForm, smtpPort: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="587"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                SMTP Username
                              </label>
                              <input
                                type="text"
                                value={settingsForm.smtpUser}
                                onChange={(e) => setSettingsForm({ ...settingsForm, smtpUser: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="your-email@gmail.com"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                SMTP Password
                              </label>
                              <input
                                type="password"
                                value={settingsForm.smtpPassword}
                                onChange={(e) => setSettingsForm({ ...settingsForm, smtpPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="••••••••"
                              />
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                For Gmail, use an App Password instead of your regular password
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security Settings */}
                  {settingsTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
                        
                        <div className="space-y-4 mb-6">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableTwoFactor}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableTwoFactor: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable Two-Factor Authentication
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Require 2FA for all admin accounts
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableIPWhitelist}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableIPWhitelist: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable IP Whitelist
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Only allow access from specific IP addresses
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Max Login Attempts
                            </label>
                            <input
                              type="number"
                              min="3"
                              max="10"
                              value={settingsForm.maxLoginAttempts}
                              onChange={(e) => setSettingsForm({ ...settingsForm, maxLoginAttempts: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Account locked after this many failed attempts
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Lockout Duration (minutes)
                            </label>
                            <input
                              type="number"
                              min="5"
                              max="120"
                              value={settingsForm.lockoutDuration}
                              onChange={(e) => setSettingsForm({ ...settingsForm, lockoutDuration: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              How long accounts remain locked
                            </p>
                          </div>
                        </div>
                      </div>

                      {settingsForm.enableIPWhitelist && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Allowed IP Addresses</h4>
                          <textarea
                            value={settingsForm.allowedIPs.join('\n')}
                            onChange={(e) => setSettingsForm({ ...settingsForm, allowedIPs: e.target.value.split('\n').filter(ip => ip.trim()) })}
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm"
                            placeholder="192.168.1.1&#10;10.0.0.1&#10;203.0.113.0/24"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Enter one IP address or CIDR range per line
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Course Settings */}
                  {settingsTab === 'courses' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Management</h3>
                        
                        <div className="space-y-4 mb-6">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.allowUserCourseCreation}
                              onChange={(e) => setSettingsForm({ ...settingsForm, allowUserCourseCreation: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Allow User Course Creation
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Let users create and publish their own courses
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.requireCourseApproval}
                              onChange={(e) => setSettingsForm({ ...settingsForm, requireCourseApproval: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Require Course Approval
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Courses must be approved before publishing
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableCourseRatings}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableCourseRatings: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable Course Ratings
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Allow users to rate courses
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableCourseComments}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableCourseComments: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable Course Comments
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Allow users to comment on courses
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Default Course Visibility
                            </label>
                            <select
                              value={settingsForm.defaultCourseVisibility}
                              onChange={(e) => setSettingsForm({ ...settingsForm, defaultCourseVisibility: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                              <option value="unlisted">Unlisted</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Max Courses Per User
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={settingsForm.maxCoursesPerUser}
                              onChange={(e) => setSettingsForm({ ...settingsForm, maxCoursesPerUser: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Content Moderation</h4>
                        <div className="space-y-4">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.moderateComments}
                              onChange={(e) => setSettingsForm({ ...settingsForm, moderateComments: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Moderate Comments
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Comments require approval before being published
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.allowAnonymousComments}
                              onChange={(e) => setSettingsForm({ ...settingsForm, allowAnonymousComments: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Allow Anonymous Comments
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Users can comment without logging in
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* System Settings */}
                  {settingsTab === 'system' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Configuration</h3>
                        
                        <div className="space-y-4 mb-6">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.maintenanceMode}
                              onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Maintenance Mode
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Disable site for maintenance (admins can still access)
                              </span>
                            </div>
                          </label>

                          {settingsForm.maintenanceMode && (
                            <div className="ml-7">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Maintenance Message
                              </label>
                              <textarea
                                value={settingsForm.maintenanceMessage}
                                onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMessage: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="Message to display during maintenance"
                              />
                            </div>
                          )}

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.debugMode}
                              onChange={(e) => setSettingsForm({ ...settingsForm, debugMode: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Debug Mode
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Enable detailed error messages and logging
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Log Level
                            </label>
                            <select
                              value={settingsForm.logLevel}
                              onChange={(e) => setSettingsForm({ ...settingsForm, logLevel: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                              <option value="error">Error Only</option>
                              <option value="warn">Warning & Error</option>
                              <option value="info">Info, Warning & Error</option>
                              <option value="debug">All (Debug)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Backup Frequency
                            </label>
                            <select
                              value={settingsForm.backupFrequency}
                              onChange={(e) => setSettingsForm({ ...settingsForm, backupFrequency: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Notifications</h4>
                        <div className="space-y-4">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableInAppNotifications}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableInAppNotifications: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                In-App Notifications
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Show notifications within the application
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enablePushNotifications}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enablePushNotifications: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Push Notifications
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Send browser push notifications
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableSMSNotifications}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableSMSNotifications: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                SMS Notifications
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Send text message notifications
                              </span>
                            </div>
                          </label>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Notification Frequency
                            </label>
                            <select
                              value={settingsForm.notificationFrequency}
                              onChange={(e) => setSettingsForm({ ...settingsForm, notificationFrequency: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                              <option value="immediate">Immediate</option>
                              <option value="hourly">Hourly Digest</option>
                              <option value="daily">Daily Digest</option>
                              <option value="weekly">Weekly Digest</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced Settings */}
                  {settingsTab === 'advanced' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance & Optimization</h3>
                        
                        <div className="space-y-4 mb-6">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.cacheEnabled}
                              onChange={(e) => setSettingsForm({ ...settingsForm, cacheEnabled: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable Caching
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Cache content for faster loading
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableCDN}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableCDN: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable CDN
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Serve static assets from CDN
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Cache Duration (seconds)
                            </label>
                            <input
                              type="number"
                              min="60"
                              max="86400"
                              value={settingsForm.cacheDuration}
                              onChange={(e) => setSettingsForm({ ...settingsForm, cacheDuration: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Max Upload Size (MB)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={settingsForm.maxUploadSize}
                              onChange={(e) => setSettingsForm({ ...settingsForm, maxUploadSize: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          {settingsForm.enableCDN && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CDN URL
                              </label>
                              <input
                                type="url"
                                value={settingsForm.cdnUrl}
                                onChange={(e) => setSettingsForm({ ...settingsForm, cdnUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="https://cdn.yoursite.com"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Analytics</h4>
                        <div className="space-y-4">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableAnalytics}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableAnalytics: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Enable Analytics
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Track site usage and user behavior
                              </span>
                            </div>
                          </label>

                          {settingsForm.enableAnalytics && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Analytics Provider
                                </label>
                                <select
                                  value={settingsForm.analyticsProvider}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, analyticsProvider: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="google">Google Analytics</option>
                                  <option value="matomo">Matomo</option>
                                  <option value="plausible">Plausible</option>
                                  <option value="custom">Custom</option>
                                </select>
                              </div>

                              {settingsForm.analyticsProvider === 'google' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Google Analytics ID
                                  </label>
                                  <input
                                    type="text"
                                    value={settingsForm.googleAnalyticsId}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="G-XXXXXXXXXX"
                                  />
                                </div>
                              )}

                              <label className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  checked={settingsForm.trackUserBehavior}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, trackUserBehavior: e.target.checked })}
                                  className="mt-1 w-4 h-4 rounded"
                                />
                                <div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Track User Behavior
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Track detailed user interactions
                                  </span>
                                </div>
                              </label>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Localization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Default Language
                            </label>
                            <select
                              value={settingsForm.defaultLanguage}
                              onChange={(e) => setSettingsForm({ ...settingsForm, defaultLanguage: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="zh">Chinese</option>
                              <option value="ja">Japanese</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-3 mt-7">
                              <input
                                type="checkbox"
                                checked={settingsForm.enableMultiLanguage}
                                onChange={(e) => setSettingsForm({ ...settingsForm, enableMultiLanguage: e.target.checked })}
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enable Multi-Language Support
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {settingsForm.enablePayments && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Payment Settings</h4>
                          <div className="space-y-4">
                            <label className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                checked={settingsForm.enablePayments}
                                onChange={(e) => setSettingsForm({ ...settingsForm, enablePayments: e.target.checked })}
                                className="mt-1 w-4 h-4 rounded"
                              />
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                  Enable Payments
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Allow paid courses and subscriptions
                                </span>
                              </div>
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Payment Provider
                                </label>
                                <select
                                  value={settingsForm.paymentProvider}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentProvider: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="stripe">Stripe</option>
                                  <option value="paypal">PayPal</option>
                                  <option value="square">Square</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Currency
                                </label>
                                <select
                                  value={settingsForm.currency}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="USD">USD ($)</option>
                                  <option value="EUR">EUR (€)</option>
                                  <option value="GBP">GBP (£)</option>
                                  <option value="INR">INR (₹)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Tax Rate (%)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={settingsForm.taxRate}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, taxRate: parseFloat(e.target.value) })}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* System Information Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  System Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalUsers || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.totalCourses || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.totalEnrollments || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enrollments</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {settingsForm.maintenanceMode ? 'Offline' : 'Online'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">System Status</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module Management Modal */}
          {managingModules && (
            <ModuleForm
              courseId={managingModules._id}
              existingModules={managingModules.modules || []}
              onSave={handleSaveModules}
              onCancel={() => setManagingModules(null)}
            />
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminPanel;
