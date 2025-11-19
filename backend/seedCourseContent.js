import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const javaCourseContent = {
  modules: [
    {
      moduleId: 'java-intro',
      title: 'Introduction to Java',
      description: 'Get started with Java programming fundamentals',
      order: 1,
      topics: [
        {
          topicId: 'what-is-java',
          title: 'What is Java?',
          description: 'Learn about Java programming language and its features',
          order: 1,
          estimatedTime: '15 mins',
          hasPractice: false
        },
        {
          topicId: 'setup-environment',
          title: 'Setting Up Development Environment',
          description: 'Install JDK and set up your first Java project',
          order: 2,
          estimatedTime: '30 mins',
          hasPractice: true
        },
        {
          topicId: 'first-program',
          title: 'Your First Java Program',
          description: 'Write and run your first Hello World program',
          order: 3,
          estimatedTime: '20 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'java-basics',
      title: 'Java Basics',
      description: 'Master the fundamentals of Java syntax',
      order: 2,
      topics: [
        {
          topicId: 'variables-datatypes',
          title: 'Variables and Data Types',
          description: 'Understanding primitive and reference types in Java',
          order: 1,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'operators',
          title: 'Operators in Java',
          description: 'Arithmetic, logical, and relational operators',
          order: 2,
          estimatedTime: '30 mins',
          hasPractice: true
        },
        {
          topicId: 'control-flow',
          title: 'Control Flow Statements',
          description: 'If-else, switch, and conditional statements',
          order: 3,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'loops',
          title: 'Loops in Java',
          description: 'For, while, and do-while loops',
          order: 4,
          estimatedTime: '45 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'oop-concepts',
      title: 'Object-Oriented Programming',
      description: 'Learn OOP principles in Java',
      order: 3,
      topics: [
        {
          topicId: 'classes-objects',
          title: 'Classes and Objects',
          description: 'Creating and using classes and objects',
          order: 1,
          estimatedTime: '50 mins',
          hasPractice: true
        },
        {
          topicId: 'constructors',
          title: 'Constructors',
          description: 'Default and parameterized constructors',
          order: 2,
          estimatedTime: '35 mins',
          hasPractice: true
        },
        {
          topicId: 'inheritance',
          title: 'Inheritance',
          description: 'Extending classes and method overriding',
          order: 3,
          estimatedTime: '55 mins',
          hasPractice: true
        },
        {
          topicId: 'polymorphism',
          title: 'Polymorphism',
          description: 'Method overloading and overriding',
          order: 4,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'encapsulation',
          title: 'Encapsulation',
          description: 'Access modifiers and data hiding',
          order: 5,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'abstraction',
          title: 'Abstraction',
          description: 'Abstract classes and interfaces',
          order: 6,
          estimatedTime: '50 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'advanced-java',
      title: 'Advanced Java Concepts',
      description: 'Explore advanced Java features',
      order: 4,
      topics: [
        {
          topicId: 'exception-handling',
          title: 'Exception Handling',
          description: 'Try-catch blocks and custom exceptions',
          order: 1,
          estimatedTime: '55 mins',
          hasPractice: true
        },
        {
          topicId: 'collections',
          title: 'Collections Framework',
          description: 'Lists, Sets, Maps, and iterators',
          order: 2,
          estimatedTime: '1 hour',
          hasPractice: true
        },
        {
          topicId: 'streams',
          title: 'Java Streams API',
          description: 'Functional programming with streams',
          order: 3,
          estimatedTime: '1 hour',
          hasPractice: true
        },
        {
          topicId: 'multithreading',
          title: 'Multithreading',
          description: 'Creating and managing threads',
          order: 4,
          estimatedTime: '1.5 hours',
          hasPractice: true
        }
      ]
    }
  ]
};

const cppCourseContent = {
  modules: [
    {
      moduleId: 'cpp-intro',
      title: 'Introduction to C++',
      description: 'Getting started with C++ programming',
      order: 1,
      topics: [
        {
          topicId: 'what-is-cpp',
          title: 'What is C++?',
          description: 'Learn about C++ and its features',
          order: 1,
          estimatedTime: '15 mins',
          hasPractice: false
        },
        {
          topicId: 'setup-cpp',
          title: 'Setting Up C++ Environment',
          description: 'Install compiler and IDE',
          order: 2,
          estimatedTime: '30 mins',
          hasPractice: true
        },
        {
          topicId: 'first-cpp-program',
          title: 'Your First C++ Program',
          description: 'Hello World in C++',
          order: 3,
          estimatedTime: '20 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'cpp-basics',
      title: 'C++ Fundamentals',
      description: 'Master C++ syntax and basic concepts',
      order: 2,
      topics: [
        {
          topicId: 'variables-cpp',
          title: 'Variables and Data Types',
          description: 'Understanding C++ data types',
          order: 1,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'operators-cpp',
          title: 'Operators in C++',
          description: 'Arithmetic, logical, and bitwise operators',
          order: 2,
          estimatedTime: '35 mins',
          hasPractice: true
        },
        {
          topicId: 'control-structures',
          title: 'Control Structures',
          description: 'If-else, switch statements',
          order: 3,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'loops-cpp',
          title: 'Loops in C++',
          description: 'For, while, and do-while loops',
          order: 4,
          estimatedTime: '45 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'cpp-functions',
      title: 'Functions and Arrays',
      description: 'Working with functions and arrays',
      order: 3,
      topics: [
        {
          topicId: 'functions',
          title: 'Functions',
          description: 'Creating and using functions',
          order: 1,
          estimatedTime: '50 mins',
          hasPractice: true
        },
        {
          topicId: 'arrays',
          title: 'Arrays',
          description: 'Single and multi-dimensional arrays',
          order: 2,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'pointers',
          title: 'Pointers',
          description: 'Understanding pointers and memory',
          order: 3,
          estimatedTime: '1 hour',
          hasPractice: true
        },
        {
          topicId: 'references',
          title: 'References',
          description: 'Working with references',
          order: 4,
          estimatedTime: '40 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'cpp-oop',
      title: 'Object-Oriented Programming in C++',
      description: 'Learn OOP concepts in C++',
      order: 4,
      topics: [
        {
          topicId: 'classes-cpp',
          title: 'Classes and Objects',
          description: 'Creating classes in C++',
          order: 1,
          estimatedTime: '55 mins',
          hasPractice: true
        },
        {
          topicId: 'constructors-cpp',
          title: 'Constructors and Destructors',
          description: 'Object initialization and cleanup',
          order: 2,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'inheritance-cpp',
          title: 'Inheritance',
          description: 'Class inheritance in C++',
          order: 3,
          estimatedTime: '50 mins',
          hasPractice: true
        },
        {
          topicId: 'polymorphism-cpp',
          title: 'Polymorphism',
          description: 'Virtual functions and runtime polymorphism',
          order: 4,
          estimatedTime: '55 mins',
          hasPractice: true
        }
      ]
    }
  ]
};

const dsaCourseContent = {
  modules: [
    {
      moduleId: 'dsa-intro',
      title: 'Introduction to DSA',
      description: 'Understanding data structures and algorithms',
      order: 1,
      topics: [
        {
          topicId: 'what-is-dsa',
          title: 'What are Data Structures?',
          description: 'Introduction to data structures',
          order: 1,
          estimatedTime: '20 mins',
          hasPractice: false
        },
        {
          topicId: 'complexity-analysis',
          title: 'Time and Space Complexity',
          description: 'Big O notation and complexity analysis',
          order: 2,
          estimatedTime: '45 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'arrays-strings',
      title: 'Arrays and Strings',
      description: 'Master array and string operations',
      order: 2,
      topics: [
        {
          topicId: 'array-basics',
          title: 'Array Operations',
          description: 'Basic array manipulations',
          order: 1,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'string-operations',
          title: 'String Manipulation',
          description: 'Common string operations',
          order: 2,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'two-pointers',
          title: 'Two Pointer Technique',
          description: 'Solving problems with two pointers',
          order: 3,
          estimatedTime: '50 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'linked-lists',
      title: 'Linked Lists',
      description: 'Understanding linked data structures',
      order: 3,
      topics: [
        {
          topicId: 'singly-linked-list',
          title: 'Singly Linked Lists',
          description: 'Implementation and operations',
          order: 1,
          estimatedTime: '1 hour',
          hasPractice: true
        },
        {
          topicId: 'doubly-linked-list',
          title: 'Doubly Linked Lists',
          description: 'Bidirectional linked lists',
          order: 2,
          estimatedTime: '50 mins',
          hasPractice: true
        },
        {
          topicId: 'circular-linked-list',
          title: 'Circular Linked Lists',
          description: 'Circular list implementations',
          order: 3,
          estimatedTime: '45 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'stacks-queues',
      title: 'Stacks and Queues',
      description: 'LIFO and FIFO data structures',
      order: 4,
      topics: [
        {
          topicId: 'stacks',
          title: 'Stacks',
          description: 'Stack implementation and applications',
          order: 1,
          estimatedTime: '50 mins',
          hasPractice: true
        },
        {
          topicId: 'queues',
          title: 'Queues',
          description: 'Queue implementation and variants',
          order: 2,
          estimatedTime: '50 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'trees',
      title: 'Trees',
      description: 'Hierarchical data structures',
      order: 5,
      topics: [
        {
          topicId: 'binary-trees',
          title: 'Binary Trees',
          description: 'Binary tree basics',
          order: 1,
          estimatedTime: '1 hour',
          hasPractice: true
        },
        {
          topicId: 'bst',
          title: 'Binary Search Trees',
          description: 'BST operations',
          order: 2,
          estimatedTime: '1 hour',
          hasPractice: true
        },
        {
          topicId: 'tree-traversals',
          title: 'Tree Traversals',
          description: 'Inorder, preorder, postorder',
          order: 3,
          estimatedTime: '50 mins',
          hasPractice: true
        }
      ]
    }
  ]
};

const webDevCourseContent = {
  modules: [
    {
      moduleId: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Learn the building blocks of the web',
      order: 1,
      topics: [
        {
          topicId: 'intro-html',
          title: 'Introduction to HTML',
          description: 'What is HTML and how it works',
          order: 1,
          estimatedTime: '20 mins',
          hasPractice: false
        },
        {
          topicId: 'html-elements',
          title: 'HTML Elements and Tags',
          description: 'Common HTML tags and elements',
          order: 2,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'html-forms',
          title: 'HTML Forms',
          description: 'Creating interactive forms',
          order: 3,
          estimatedTime: '45 mins',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'css-basics',
      title: 'CSS Styling',
      description: 'Style your web pages',
      order: 2,
      topics: [
        {
          topicId: 'intro-css',
          title: 'Introduction to CSS',
          description: 'CSS syntax and selectors',
          order: 1,
          estimatedTime: '30 mins',
          hasPractice: true
        },
        {
          topicId: 'box-model',
          title: 'CSS Box Model',
          description: 'Understanding margin, padding, border',
          order: 2,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'flexbox',
          title: 'Flexbox Layout',
          description: 'Modern CSS layout with flexbox',
          order: 3,
          estimatedTime: '50 mins',
          hasPractice: true
        },
        {
          topicId: 'grid',
          title: 'CSS Grid',
          description: 'Two-dimensional layouts',
          order: 4,
          estimatedTime: '1 hour',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'javascript-basics',
      title: 'JavaScript Fundamentals',
      description: 'Add interactivity to your websites',
      order: 3,
      topics: [
        {
          topicId: 'intro-js',
          title: 'Introduction to JavaScript',
          description: 'JavaScript basics',
          order: 1,
          estimatedTime: '30 mins',
          hasPractice: true
        },
        {
          topicId: 'js-variables',
          title: 'Variables and Data Types',
          description: 'Working with data in JavaScript',
          order: 2,
          estimatedTime: '40 mins',
          hasPractice: true
        },
        {
          topicId: 'js-functions',
          title: 'Functions',
          description: 'Creating reusable code',
          order: 3,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'dom-manipulation',
          title: 'DOM Manipulation',
          description: 'Interacting with HTML elements',
          order: 4,
          estimatedTime: '1 hour',
          hasPractice: true
        }
      ]
    },
    {
      moduleId: 'responsive-design',
      title: 'Responsive Web Design',
      description: 'Build mobile-friendly websites',
      order: 4,
      topics: [
        {
          topicId: 'media-queries',
          title: 'Media Queries',
          description: 'Responsive breakpoints',
          order: 1,
          estimatedTime: '45 mins',
          hasPractice: true
        },
        {
          topicId: 'mobile-first',
          title: 'Mobile-First Design',
          description: 'Building for mobile devices',
          order: 2,
          estimatedTime: '50 mins',
          hasPractice: true
        }
      ]
    }
  ]
};

const seedCourseContent = async () => {
  try {
    await connectDB();

    // Find courses by title
    const javaCourse = await Course.findOne({ title: { $regex: /java/i } });
    const cppCourse = await Course.findOne({ title: { $regex: /c\+\+/i } });
    const dsaCourse = await Course.findOne({ title: { $regex: /data structures/i } });
    const webDevCourse = await Course.findOne({ title: { $regex: /web development/i } });

    // Update Java course
    if (javaCourse) {
      javaCourse.modules = javaCourseContent.modules;
      await javaCourse.save();
      console.log('✅ Java course content updated');
    } else {
      console.log('⚠️ Java course not found');
    }

    // Update C++ course
    if (cppCourse) {
      cppCourse.modules = cppCourseContent.modules;
      await cppCourse.save();
      console.log('✅ C++ course content updated');
    } else {
      console.log('⚠️ C++ course not found');
    }

    // Update DSA course
    if (dsaCourse) {
      dsaCourse.modules = dsaCourseContent.modules;
      await dsaCourse.save();
      console.log('✅ DSA course content updated');
    } else {
      console.log('⚠️ DSA course not found');
    }

    // Update Web Development course
    if (webDevCourse) {
      webDevCourse.modules = webDevCourseContent.modules;
      await webDevCourse.save();
      console.log('✅ Web Development course content updated');
    } else {
      console.log('⚠️ Web Development course not found');
    }

    console.log('\n✅ Course content seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding course content:', error);
    process.exit(1);
  }
};

seedCourseContent();
