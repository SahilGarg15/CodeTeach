import { Book, Code, Video, FileText } from 'lucide-react';
import React from 'react';

export const COURSES = [
  {
    _id: '1',
    title: 'Java Programming',
    description: 'Comprehensive course covering Java fundamentals, object-oriented programming, and advanced concepts.',
    difficulty: 'Beginner to Advanced',
    icon: <Code size={32} className="text-purple-600 dark:text-purple-400" />,
    duration: '40',
    path: '/modules/java'
  },
  {
    _id: '2',
    title: 'C++ Mastery',
    description: 'Deep dive into C++ programming, covering language intricacies, system-level programming, and best practices.',
    difficulty: 'Intermediate to Advanced',
    icon: <Book size={32} className="text-blue-600 dark:text-blue-400" />,
    duration: '50',
    path: '/modules/cpp'
  },
  {
    _id: '3',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive course on data structures, algorithm design, analysis, and problem-solving techniques.',
    difficulty: 'Advanced',
    icon: <Video size={32} className="text-green-600 dark:text-green-400" />,
    duration: '12 weeks',
    path: '/modules/dsa'
  },
  {
    _id: '4',
    title: 'Web Development Bootcamp',
    description: 'Full-stack web development course covering frontend, backend, and modern web technologies.',
    difficulty: 'Comprehensive',
    icon: <FileText size={32} className="text-red-600 dark:text-red-400" />,
    duration: '16 weeks',
    path: '/modules/web-development'
  }
];
