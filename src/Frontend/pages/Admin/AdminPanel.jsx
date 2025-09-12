import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, LineChart, Settings, LogOut, Plus, Edit, Trash2, Menu, X } from 'lucide-react';
import config from '../../../config/config';
import UsersComponent from './Components/Users';
import CoursesComponent from './Components/Courses';

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

  useEffect(() => {
    checkAdminSession();
    fetchAdminData();
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const checkAdminSession = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token || !user.isAdmin) {
      handleLogout();
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Not authorized');
      }

      const data = await response.json();
      setStats(data.stats);
      setUsers(data.recentUsers);
      setCourses(data.recentCourses);
    } catch (error) {
      console.error('Admin fetch error:', error);
      navigate('/auth');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Fetch users error:', error);
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
      const response = await fetch(`${config.api.baseUrl}/admin/courses`, {
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
      const response = await fetch(`${config.api.baseUrl}/admin/courses/${editingCourse._id}`, {
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
      const response = await fetch(`${config.api.baseUrl}/admin/courses/${courseId}`, {
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
      const response = await fetch(`${config.api.baseUrl}/admin/users/${userId}`, {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button - Improved touch target */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden touch-manipulation"
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
                    {users.map(user => (
                      <div key={user._id} className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Courses */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Courses</h3>
                  <div className="space-y-4">
                    {courses.map(course => (
                      <div key={course._id} className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{course.category}</p>
                        </div>
                      </div>
                    ))}
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
            />
          )}

          {activeTab === "settings" && (
  <div>
    <h2 className="text-xl font-bold mb-4 ">Settings</h2>
    <p>Settings panel coming soon!</p>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
