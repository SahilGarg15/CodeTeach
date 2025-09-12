import React from 'react';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

// Topic card component for consistent styling
const TopicCard = ({ title, emoji, description, subtopics }) => (
  <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.01]">
    <div className="flex items-start gap-4">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <h3 className="text-xl text-blue-400 mb-2">{title}</h3>
        <p className="text-gray-300 mb-4 text-sm">{description}</p>
        <div className="space-y-2">
          {subtopics.map((topic, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-300 group">
              <span className="text-green-400 group-hover:scale-110 transition-transform">▪</span>
              <span className="text-sm">{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TopicsCovered = () => {
  const courseContent = [
    {
      title: "Getting Started with Java",
      emoji: "🚀",
      description: "Your first steps into the world of Java programming. We'll start super simple!",
      subtopics: [
        "Installing Java (JDK) and writing your first program",
        "Understanding what makes Java special",
        "Basic program structure and how Java works",
        "Using VS Code or IntelliJ IDEA for coding"
      ]
    },
    {
      title: "Java Building Blocks",
      emoji: "🧱",
      description: "Learn the essential pieces that make up every Java program.",
      subtopics: [
        "Variables - storing different types of data",
        "Numbers, text (Strings), and other data types",
        "Basic math operations and calculations",
        "Converting between different data types"
      ]
    },
    {
      title: "Making Decisions in Code",
      emoji: "🤔",
      description: "Make your programs smart by teaching them to make decisions.",
      subtopics: [
        "If-else statements (like giving your code choices)",
        "Switch statements (handling multiple choices)",
        "Comparison operators (>, <, ==, etc.)",
        "Boolean logic (true/false decisions)"
      ]
    },
    {
      title: "Loops and Repetition",
      emoji: "🔄",
      description: "Make your programs do things over and over without writing the same code.",
      subtopics: [
        "For loops (counting and repeating)",
        "While loops (repeating until something happens)",
        "Break and continue (controlling your loops)",
        "Loop exercises and common patterns"
      ]
    },
    {
      title: "Working with Functions",
      emoji: "🛠️",
      description: "Create reusable blocks of code to organize your programs better.",
      subtopics: [
        "Creating and calling functions",
        "Function parameters and return values",
        "Method overloading (same name, different inputs)",
        "Built-in Java functions you can use"
      ]
    },
    {
      title: "Object-Oriented Basics",
      emoji: "🎨",
      description: "Learn to organize your code like building with LEGO blocks.",
      subtopics: [
        "Classes and Objects (creating your own types)",
        "Properties and Methods (what objects know and can do)",
        "Constructors (creating new objects)",
        "Access modifiers (public, private, protected)"
      ]
    }
  ];

  const practiceFeatures = [
    { icon: "✓", text: "Interactive code examples" },
    { icon: "✓", text: "Hands-on exercises" },
    { icon: "✓", text: "Mini-projects" },
    { icon: "✓", text: "Knowledge checks" }
  ];

  const sections = courseContent.map((content, index) => ({
    icon: content.emoji,
    title: content.title,
    content: [content.description, ...content.subtopics],
    code: null
  }));

  return (
    <div className="space-y-8">
      <Summary 
        title="Your Java Learning Journey 🗺️"
        description="Don't worry about understanding everything at once! We'll take it step by step, with lots of examples and practice exercises. Think of it like building a house - we'll start with the foundation and work our way up! 🏗️"
      />

      <ConceptExplanation sections={sections} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Learning Methods 📚"
          items={[
            { icon: "📝", text: "Step-by-step tutorials" },
            { icon: "💻", text: "Interactive coding" },
            { icon: "🎯", text: "Practical examples" },
            { icon: "🧪", text: "Instant feedback" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="What You'll Learn 🎓"
          items={[
            { icon: "🏗️", text: "Core Java concepts" },
            { icon: "🧩", text: "Problem-solving skills" },
            { icon: "📦", text: "Object-oriented programming" },
            { icon: "⚡", text: "Best practices" }
          ]}
          variant="purple"
        />
      </div>

      <ImportantNote
        title="Practice Makes Perfect! 🎯"
        points={[
          "Each section includes interactive examples",
          "Regular hands-on exercises",
          "Real-world mini-projects",
          "Self-assessment opportunities"
        ]}
        variant="green"
      />

      <KeyFeatures
        title="Course Features ⭐"
        items={practiceFeatures}
        variant="yellow"
      />

      <Summary 
        title="Ready to Begin? 🚀"
        description={`
          We've designed this course to be:
          • Beginner-friendly
          • Hands-on and practical
          • Step-by-step progression
          • Rich in examples and exercises
          • Focused on real-world skills
        `}
        variant="green"
      />
    </div>
  );
};

export default TopicsCovered;
