export const COURSE_IDS = {
  JAVA: "java_programming_001",
  CPP: "cpp_programming_001",
  WEBDEV: "web_development_001",
  DSA: "dsa_course_001"
};

// Course constants
export const COURSES = {
  JAVA: {
    id: COURSE_IDS.JAVA,
    title: "Java Programming",
    shortName: "Java",
    path: "/modules/java"
  },
  CPP: {
    id: COURSE_IDS.CPP,
    title: "C++ Programming",
    shortName: "C++",
    path: "/modules/cpp"
  },
  // Add other courses as needed
};

// Validation helper
export const isValidCourseId = (courseId) => {
  return Object.values(COURSE_IDS).includes(courseId);
};
