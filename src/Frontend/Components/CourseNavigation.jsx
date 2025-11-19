import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, ClipboardList, FileText, Star, Award } from 'lucide-react';

const CourseNavigation = () => {
  const { courseId } = useParams();
  const location = useLocation();

  const navItems = [
    { path: `/course/${courseId}/modules`, icon: BookOpen, label: 'Modules' },
    { path: `/course/${courseId}/discussions`, icon: MessageSquare, label: 'Discussions' },
    { path: `/course/${courseId}/quizzes`, icon: ClipboardList, label: 'Quizzes' },
    { path: `/course/${courseId}/assignments`, icon: FileText, label: 'Assignments' },
    { path: `/course/${courseId}/reviews`, icon: Star, label: 'Reviews' },
  ];

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-16 z-30 shadow-lg overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                active
                  ? 'text-purple-400 border-purple-500'
                  : 'text-gray-300 border-transparent hover:text-white hover:border-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
      </div>
    </nav>
  );
};

export default CourseNavigation;
