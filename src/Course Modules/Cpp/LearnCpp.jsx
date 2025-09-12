import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CourseLayout from '../../Frontend/Components/Interface Components/interface';
import { modules } from '../../Frontend/Components/Module Component/Cpp Modules';

const LearnCpp = () => {
  const { courseId } = useParams();
  
  // Check if accessing the root path, redirect to first module if so
  if (window.location.pathname === `/course/${courseId}/modules`) {
    const firstModule = modules[0];
    const firstSubModule = firstModule.subModules[0];
    return <Navigate to={`${firstModule.id}/${firstSubModule.id}`} replace />;
  }
  
  return (
    <CourseLayout 
      courseName="C++ Programming" 
      courseShortName="C++" 
      modules={modules}
      basePath={`/course/${courseId}/modules`}
    />
  );
};

export default LearnCpp;
