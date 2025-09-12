import React, { useState } from 'react';
import { createPortal } from 'react-dom';  // Add this import
import CodeEditor from '../../../Frontend/Components/Code Components/CodeEditor';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';

const Set1Datatypes = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentExample, setCurrentExample] = useState(null);
  const [expandedHints, setExpandedHints] = useState({});
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const mcqQuestions = [
    {
      id: 1,
      question: "Which of the following is the correct way to declare a String variable in Java?",
      options: [
        "string name = 'John';",
        "String name = 'John';",
        "String name = \"John\";",
        "str name = \"John\";"
      ],
      correctAnswer: 2,
      explanation: "In Java, String is a class and requires double quotes for text values."
    },
    {
      id: 2,
      question: "What is the default value of an int variable in Java?",
      options: [
        "0",
        "null",
        "undefined",
        "1"
      ],
      correctAnswer: 0,
      explanation: "The default value for numeric types like int in Java is 0."
    },
    {
      id: 3,
      question: "Which data type should be used to store a single character in Java?",
      options: [
        "String",
        "char",
        "Character",
        "text"
      ],
      correctAnswer: 1,
      explanation: "char is used to store a single character and uses single quotes."
    },
    // Add more basic MCQs
    {
      id: 4,
      question: "What symbol is used to end statements in Java?",
      options: [
        ".",
        ";",
        ":",
        ","
      ],
      correctAnswer: 1,
      explanation: "In Java, statements must end with a semicolon (;)."
    },
    {
      id: 5,
      question: "How do you write a comment in Java?",
      options: [
        "# This is a comment",
        "// This is a comment",
        "<!-- This is a comment -->",
        "% This is a comment"
      ],
      correctAnswer: 1,
      explanation: "In Java, single-line comments start with //."
    },
    {
      id: 6,
      question: "What will be the output of: System.out.println(\"Hello\" + 5 + 3);",
      options: [
        "Hello53",
        "Hello8",
        "53Hello",
        "8Hello"
      ],
      correctAnswer: 0,
      explanation: "When + is used with a String, it performs concatenation from left to right. So 'Hello' + 5 becomes 'Hello5', then + 3 becomes 'Hello53'.",
      codeExample: `public class Example {
    public static void main(String[] args) {
        System.out.println("Hello" + 5 + 3);
        // Output: Hello53
    }
}`
    },
    {
      id: 7,
      question: "Which of the following will print text on the same line?",
      options: [
        "System.out.println()",
        "System.out.print()",
        "System.println()",
        "System.print()"
      ],
      correctAnswer: 1,
      explanation: "System.out.print() prints without adding a new line, while println() adds a new line after printing.",
      codeExample: `public class Example {
    public static void main(String[] args) {
        System.out.print("Hello ");
        System.out.print("World");
        // Output: Hello World (on same line)
    }
}`
    },
    {
      id: 8,
      question: "What happens when you use + with two numbers and a String?",
      options: [
        "It always concatenates everything as strings",
        "It performs addition first, then concatenates with the string",
        "It throws an error",
        "It ignores the numbers"
      ],
      correctAnswer: 1,
      explanation: "When numbers appear together in parentheses, Java performs the arithmetic first, then concatenates with strings.",
      codeExample: `public class Example {
    public static void main(String[] args) {
        System.out.println("Result: " + (5 + 3));
        // Output: Result: 8
    }
}`
    },
    {
      id: 9,
      question: "Which is the correct way to print multiple variables?",
      options: [
        "System.out.println(name + age + grade)",
        "System.out.println('name age grade')",
        "System.out.println(\"Name: \" + name + \", Age: \" + age)",
        "System.out.println(name age grade)"
      ],
      correctAnswer: 2,
      explanation: "Use + to concatenate strings and variables, adding descriptive text in quotes helps readability.",
      codeExample: `public class Example {
    public static void main(String[] args) {
        String name = "John";
        int age = 25;
        System.out.println("Name: " + name + ", Age: " + age);
        // Output: Name: John, Age: 25
    }
}`
    },
    {
      id: 10,
      question: "What will System.out.println(5 + 5 + \"Hello\") output?",
      options: [
        "5 + 5Hello",
        "10Hello",
        "Hello10",
        "55Hello"
      ],
      correctAnswer: 1,
      explanation: "Addition is performed first (5 + 5 = 10), then concatenated with 'Hello'.",
      codeExample: `public class Example {
    public static void main(String[] args) {
        System.out.println(5 + 5 + "Hello");
        // Output: 10Hello
    }
}`
    }
  ];

  const codingExercises = {
    exercise1: {
      title: "Exercise 1: Print Hello World",
      description: "Write a program to print 'Hello, World!' to the console using System.out.println()",
      template: `public class PrintHello {
    public static void main(String[] args) {
        // Write your code here
        
    }
}`,
      solution: `System.out.println("Hello, World!");`,
      hint: "Use System.out.println() with the text in double quotes"
    },
    exercise2: {
      title: "Exercise 2: Print Multiple Lines",
      description: "Create a program that prints your name and age on separate lines",
      template: `public class PrintInfo {
    public static void main(String[] args) {
        // Create two variables:
        // 1. name (String)
        // 2. age (int)
        // Then print them on separate lines
        
    }
}`,
      solution: `String name = "John";
int age = 25;
System.out.println("Name: " + name);
System.out.println("Age: " + age);`,
      hint: "Declare your variables first, then use System.out.println() for each line"
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    
    const question = mcqQuestions.find(q => q.id === questionId);
    if (optionIndex === question.correctAnswer && question.codeExample) {
      setCurrentExample(question.codeExample);
      setShowCodeModal(true);
    }
  };

  const toggleHint = (exerciseKey) => {
    setExpandedHints(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  const toggleSolution = (exerciseKey) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  const CodeModal = ({ code, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full mx-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-200">Example Code</h3>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <CodeSnippet 
          code={code} 
          language="java"
          showLineNumbers={true}
          showCopyButton={true}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/50
              hover:bg-blue-500/30 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const renderCodingExercises = () => (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-400">Coding Exercises</h2>
      
      {Object.entries(codingExercises).map(([key, exercise]) => (
        <div key={key} className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
            <h3 className="text-xl font-medium text-green-400 mb-3">{exercise.title}</h3>
            <p className="text-gray-300 mb-4">{exercise.description}</p>
            
            <div className="space-y-4">
              <CodeEditor defaultCode={exercise.template} />
              
              {/* Hint Section */}
              <div className="border border-yellow-500/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleHint(key)}
                  className="w-full px-4 py-2 bg-yellow-500/10 text-yellow-400 
                    hover:bg-yellow-500/20 transition-colors duration-200 text-left
                    flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <svg className={`w-4 h-4 transition-transform duration-200 ${
                      expandedHints[key] ? 'rotate-90' : ''
                    }`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Hint
                  </span>
                  <span>💡</span>
                </button>
                {expandedHints[key] && (
                  <div className="p-4 bg-yellow-500/5 border-t border-yellow-500/20">
                    <p className="text-gray-300 text-sm">{exercise.hint}</p>
                  </div>
                )}
              </div>

              {/* Solution Section */}
              <div className="border border-green-500/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSolution(key)}
                  className="w-full px-4 py-2 bg-green-500/10 text-green-400 
                    hover:bg-green-500/20 transition-colors duration-200 text-left
                    flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <svg className={`w-4 h-4 transition-transform duration-200 ${
                      expandedSolutions[key] ? 'rotate-90' : ''
                    }`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Solution
                  </span>
                  <span>✨</span>
                </button>
                {expandedSolutions[key] && (
                  <div className="border-t border-green-500/20">
                    <CodeSnippet
                      code={exercise.solution}
                      language="java"
                      showLineNumbers={true}
                      showCopyButton={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title Section */}
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Practice Set 1: Java Basics 🎯
      </h1>

      {/* MCQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Multiple Choice Questions</h2>
        {mcqQuestions.map((q) => (
          <div key={q.id} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <p className="text-gray-200 mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, index) => {
                const isSelected = selectedAnswers[q.id] === index;
                const isCorrect = index === q.correctAnswer;
                const showFeedback = isSelected;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(q.id, index)}
                    className={`w-full p-3 text-left rounded-lg transition-colors duration-200 
                      ${isSelected
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-red-500/20 border-red-500/50'
                        : 'bg-gray-900/50 border-gray-800/50'
                      } border hover:bg-gray-700/50`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 
                          ${isSelected
                            ? isCorrect
                              ? 'border-green-400 bg-green-400'
                              : 'border-red-400 bg-red-400'
                            : 'border-gray-600'
                          }`} 
                        />
                        <span className="text-gray-300">{option}</span>
                      </div>
                      {showFeedback && (
                        <span className="text-sm">
                          {isCorrect ? (
                            <span className="text-green-400">✓ Correct</span>
                          ) : (
                            <span className="text-red-400">✗ Incorrect</span>
                          )}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedAnswers[q.id] !== undefined && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">{q.explanation}</p>
                {q.codeExample && selectedAnswers[q.id] === q.correctAnswer && (
                  <p className="text-blue-400 text-sm mt-2 cursor-pointer hover:underline"
                     onClick={() => {
                       setCurrentExample(q.codeExample);
                       setShowCodeModal(true);
                     }}>
                    👉 Click to see code example
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Coding Exercises Section */}
      {renderCodingExercises()}

      <div className="p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20 mt-8">
        <h3 className="text-xl font-medium text-yellow-400 mb-3">📝 Note to Learners</h3>
        <p className="text-gray-300">
          Don't worry if you encounter questions about topics we haven't covered yet! 
          This practice set includes some advanced concepts that we'll learn in future modules. 
          Focus on the basics we've learned so far:
        </p>
        <ul className="list-disc list-inside mt-3 text-gray-300">
          <li>Basic syntax and structure of Java programs</li>
          <li>Creating and using variables</li>
          <li>Primitive data types (int, String, char, boolean)</li>
          <li>Printing to the console</li>
        </ul>
      </div>

      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
        <h3 className="text-xl font-medium text-purple-400 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Click "Check Answers" to see explanations</li>
          <li>• When you get a correct answer, click again to see the code example</li>
          <li>• Try running the example code in your IDE to see it in action</li>
          <li>• Practice combining different print statements to understand their behavior</li>
        </ul>
      </div>

      {showCodeModal && createPortal(
        <CodeModal
          code={currentExample}
          onClose={() => setShowCodeModal(false)}
        />,
        document.getElementById('modal-root') || document.body
      )}
    </div>
  );
};

export default Set1Datatypes;
