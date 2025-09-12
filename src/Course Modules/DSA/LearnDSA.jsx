import React from 'react';
import PropTypes from 'prop-types';
import CourseLayout from '../../Frontend/Components/Interface Components/interface';
import { modules } from '../../Frontend/Components/Module Component/DSA Modules';
import { COURSE_IDS } from '../../../config/courseIds';

const LearnDSA = () => {
  return (
    <CourseLayout
      courseName="Data Structures & Algorithms"
      courseShortName="DSA"
      modules={modules}
      courseId={COURSE_IDS.DSA}
      basePath="/modules/dsa"
    />
  );
};

LearnDSA.propTypes = {
  // Add any props if needed
};

export default LearnDSA;
