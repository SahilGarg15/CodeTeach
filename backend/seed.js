import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import User from './models/User.js';

dotenv.config();

const courses = [
  {
    courseId: 'java-fundamentals',
    title: 'Java Programming Fundamentals',
    description: 'Master the fundamentals of Java programming, from basic syntax to object-oriented programming concepts. Perfect for beginners starting their programming journey.',
    category: 'Java',
    level: 'Beginner',
    thumbnail: '/images/courses/java-fundamentals.jpg',
    duration: '40 hours',
    language: 'English',
    prerequisites: ['Basic computer knowledge'],
    learningOutcomes: [
      'Understand Java syntax and basic programming concepts',
      'Work with variables, data types, and operators',
      'Master control flow statements and loops',
      'Learn object-oriented programming principles',
      'Handle exceptions and errors effectively'
    ],
    modules: [
      {
        moduleId: '0',
        title: 'Introduction To Java',
        description: 'Get started with Java programming',
        order: 0,
        topics: [
          {
            topicId: '1',
            title: 'History of Java',
            description: 'Learn about the origins and evolution of Java',
            order: 1,
            componentPath: '0.Intoduction To Java/1.History.jsx',
            estimatedTime: '15 mins',
            hasPractice: false
          },
          {
            topicId: '2',
            title: 'Why Java?',
            description: 'Understand why Java is popular',
            order: 2,
            componentPath: '0.Intoduction To Java/2.WhyJava.jsx',
            estimatedTime: '20 mins',
            hasPractice: false
          },
          {
            topicId: '3',
            title: 'Topics Covered',
            description: 'Overview of what you will learn',
            order: 3,
            componentPath: '0.Intoduction To Java/3.TopicsCovered.jsx',
            estimatedTime: '10 mins',
            hasPractice: false
          },
          {
            topicId: '4',
            title: 'Installation on Windows',
            description: 'Setup Java on Windows',
            order: 4,
            componentPath: '0.Intoduction To Java/4.InstallationOfJavaOnWindows.jsx',
            estimatedTime: '25 mins',
            hasPractice: false
          },
          {
            topicId: '5',
            title: 'Installation on Mac',
            description: 'Setup Java on macOS',
            order: 5,
            componentPath: '0.Intoduction To Java/5.InstallationOfJavaInMac.jsx',
            estimatedTime: '25 mins',
            hasPractice: false
          }
        ]
      },
      {
        moduleId: '1',
        title: 'How a Program Works',
        description: 'Understanding program execution',
        order: 1,
        topics: [
          {
            topicId: '1',
            title: 'What is a Program?',
            order: 1,
            componentPath: '1.HowaprogramWorks/1.whatisaprogram.jsx',
            estimatedTime: '15 mins',
            hasPractice: false
          },
          {
            topicId: '2',
            title: 'How Does a Program Work?',
            order: 2,
            componentPath: '1.HowaprogramWorks/2.howdoesprogramworks.jsx',
            estimatedTime: '20 mins',
            hasPractice: false
          },
          {
            topicId: '3',
            title: 'What is a Compiler?',
            order: 3,
            componentPath: '1.HowaprogramWorks/3.whatisacompiler.jsx',
            estimatedTime: '20 mins',
            hasPractice: false
          },
          {
            topicId: '4',
            title: 'What is an Interpreter?',
            order: 4,
            componentPath: '1.HowaprogramWorks/4.whatisainterpreter.jsx',
            estimatedTime: '20 mins',
            hasPractice: false
          },
          {
            topicId: '5',
            title: 'What is a Code Editor?',
            order: 5,
            componentPath: '1.HowaprogramWorks/5.whatisacodeeditor.jsx',
            estimatedTime: '15 mins',
            hasPractice: false
          },
          {
            topicId: '6',
            title: 'What Type of Language is Java?',
            order: 6,
            componentPath: '1.HowaprogramWorks/6.whattypeoflanguageisjava.jsx',
            estimatedTime: '20 mins',
            hasPractice: false
          }
        ]
      },
      {
        moduleId: '2',
        title: 'Syntax and Variables',
        description: 'Learn Java syntax and variables',
        order: 2,
        topics: [
          {
            topicId: '1',
            title: 'Syntax of Java',
            order: 1,
            componentPath: '2.Syntex And Variables/1.Syntexofjava.jsx',
            estimatedTime: '30 mins',
            hasPractice: false
          },
          {
            topicId: '2',
            title: 'Variables in Java',
            order: 2,
            componentPath: '2.Syntex And Variables/2.VariablesinJava.jsx',
            estimatedTime: '25 mins',
            hasPractice: false
          },
          {
            topicId: '3',
            title: 'Data Types in Java',
            order: 3,
            componentPath: '2.Syntex And Variables/3.DatatypesinJava.jsx',
            estimatedTime: '30 mins',
            hasPractice: false
          },
          {
            topicId: '4',
            title: 'Taking Input in Java',
            order: 4,
            componentPath: '2.Syntex And Variables/4.TakingInputInJava.jsx',
            estimatedTime: '25 mins',
            hasPractice: false
          },
          {
            topicId: 'practice1',
            title: 'Practice Set: Data Types',
            order: 5,
            componentPath: '2.Syntex And Variables/PracticeSet1Datatypes.jsx',
            estimatedTime: '45 mins',
            hasPractice: true
          }
        ]
      }
    ],
    instructor: {
      name: 'Code-Teach Team',
      bio: 'Expert instructors with years of industry experience',
      avatar: '/images/instructors/default.jpg'
    },
    isPublished: true,
    isFree: true,
    price: 0,
    tags: ['Java', 'Programming', 'Beginner', 'OOP']
  },
  {
    courseId: 'cpp-fundamentals',
    title: 'C++ Programming',
    description: 'Learn C++ from scratch and master the fundamentals of one of the most powerful programming languages.',
    category: 'Cpp',
    level: 'Beginner',
    thumbnail: '/images/courses/cpp-fundamentals.jpg',
    duration: '35 hours',
    language: 'English',
    prerequisites: ['Basic computer knowledge'],
    learningOutcomes: [
      'Understand C++ syntax and concepts',
      'Learn object-oriented programming in C++',
      'Master pointers and memory management',
      'Work with STL (Standard Template Library)'
    ],
    modules: [
      {
        moduleId: '0',
        title: 'Introduction to C++',
        description: 'Getting started with C++',
        order: 0,
        topics: [
          {
            topicId: '1',
            title: 'History of C++',
            order: 1,
            componentPath: '0.IntroductionToCpp/1.History.jsx',
            estimatedTime: '15 mins',
            hasPractice: false
          },
          {
            topicId: '2',
            title: 'Why C++?',
            order: 2,
            componentPath: '0.IntroductionToCpp/2.WhyCPP.jsx',
            estimatedTime: '20 mins',
            hasPractice: false
          }
        ]
      }
    ],
    instructor: {
      name: 'Code-Teach Team',
      bio: 'Expert instructors with years of industry experience',
      avatar: '/images/instructors/default.jpg'
    },
    isPublished: true,
    isFree: true,
    price: 0,
    tags: ['C++', 'Programming', 'Beginner', 'System Programming']
  },
  {
    courseId: 'dsa-fundamentals',
    title: 'Data Structures & Algorithms',
    description: 'Master essential data structures and algorithms to ace coding interviews and build efficient software.',
    category: 'DSA',
    level: 'Intermediate',
    thumbnail: '/images/courses/dsa-fundamentals.jpg',
    duration: '60 hours',
    language: 'English',
    prerequisites: ['Basic programming knowledge in any language'],
    learningOutcomes: [
      'Understand core data structures',
      'Learn algorithm design patterns',
      'Analyze time and space complexity',
      'Solve coding interview problems',
      'Optimize code efficiency'
    ],
    modules: [],
    instructor: {
      name: 'Code-Teach Team',
      bio: 'Expert instructors with years of industry experience',
      avatar: '/images/instructors/default.jpg'
    },
    isPublished: true,
    isFree: true,
    price: 0,
    tags: ['DSA', 'Algorithms', 'Data Structures', 'Interview Prep']
  },
  {
    courseId: 'web-development',
    title: 'Complete Web Development',
    description: 'Learn full-stack web development from HTML/CSS to modern JavaScript frameworks and backend development.',
    category: 'WebDev',
    level: 'Beginner',
    thumbnail: '/images/courses/web-dev.jpg',
    duration: '80 hours',
    language: 'English',
    prerequisites: ['Basic computer knowledge'],
    learningOutcomes: [
      'Build responsive websites with HTML/CSS',
      'Master JavaScript and modern ES6+',
      'Learn React for frontend development',
      'Understand backend with Node.js',
      'Work with databases and APIs'
    ],
    modules: [],
    instructor: {
      name: 'Code-Teach Team',
      bio: 'Expert instructors with years of industry experience',
      avatar: '/images/instructors/default.jpg'
    },
    isPublished: true,
    isFree: true,
    price: 0,
    tags: ['Web Development', 'HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Inserted ${createdCourses.length} courses`);

    // Create admin user if not exists
    const adminEmail = 'admin@codeteach.com';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });
      console.log('✅ Created admin user');
      console.log('   Username: admin');
      console.log('   Email: admin@codeteach.com');
      console.log('   Password: Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample test user if not exists
    const testEmail = 'test@codeteach.com';
    let testUser = await User.findOne({ email: testEmail });
    
    if (!testUser) {
      testUser = await User.create({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: 'Test@123',
        role: 'user',
        isEmailVerified: true,
        isActive: true
      });
      console.log('✅ Created test user');
      console.log('   Username: testuser');
      console.log('   Email: test@codeteach.com');
      console.log('   Password: Test@123');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nCourses created:');
    createdCourses.forEach(course => {
      console.log(`  - ${course.title} (${course.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
