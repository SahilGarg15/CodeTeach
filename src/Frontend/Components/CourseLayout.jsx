import React from 'react';
import { Outlet } from 'react-router-dom';
import CourseNavigation from './CourseNavigation';

const CourseLayout = () => {
  return (
    <div className="min-h-screen">
      <CourseNavigation />
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default CourseLayout;
