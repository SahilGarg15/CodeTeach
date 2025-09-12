import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import CodeEditor from '../../../Frontend/Components/Code Components/CodeEditor';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';
import Hint from '../../../Frontend/Components/practice compnenets/hint';
import ViewSolution from '../../../Frontend/Components/practice compnenets/viewsolution';

const PracticeSetSwitch = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentExample, setCurrentExample] = useState(null);
  const [expandedHints, setExpandedHints] = useState({});
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const mcqQuestions = [
    {
      id: 1,
      question: "Which of the following can be used as a switch case value?",
      options: [
        "String literal",
        "enum constant",
        "Integer literal",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "In Java, switch case values can be String literals (Java 7+), enum constants, or integer literals (including byte, short, char, int)."
    },
    {
      id: 2,
      question: "What happens if you don't include a break statement in a switch case?",
      options: [
        "Compilation error",
        "Runtime error",
        "Fall-through to next case",
        "Exits the switch statement"
      ],
      correctAnswer: 2,
      explanation: "Without a break statement, execution falls through to the next case, known as 'fall-through' behavior."
    },
    {
      id: 3,
      question: "What happens when a switch statement encounters a break?",
      options: [
        "Continues to next case",
        "Exits the switch block",
        "Throws an error",
        "Restarts the switch"
      ],
      correctAnswer: 1,
      explanation: "The break statement exits the switch block and continues execution after the switch statement."
    },
    {
      id: 4,
      question: "Can you use floating-point numbers in switch cases?",
      options: [
        "Yes, always",
        "No, never",
        "Only in Java 8+",
        "Only with type casting"
      ],
      correctAnswer: 1,
      explanation: "Switch statements cannot use floating-point numbers (float, double) as case values."
    },
    {
      id: 5,
      question: "Which feature was introduced in Java 14 for switch statements?",
      options: [
        "String support",
        "Multiple case labels",
        "Arrow syntax",
        "Float support"
      ],
      correctAnswer: 2,
      explanation: "Java 14 introduced arrow syntax and yield keyword for switch expressions."
    }
  ];

  const codingExercises = {
    exercise1: {
      title: "Month Name Finder",
      description: "Create a switch statement that takes a month number (1-12) and returns the name of the month",
      template: `public class MonthFinder {
    public static void main(String[] args) {
        int month = 3;
        // TODO: Write switch statement to print month name
    }
}`,
      solution: `switch(month) {
    case 1: System.out.println("January"); break;
    case 2: System.out.println("February"); break;
    case 3: System.out.println("March"); break;
    case 4: System.out.println("April"); break;
    case 5: System.out.println("May"); break;
    case 6: System.out.println("June"); break;
    case 7: System.out.println("July"); break;
    case 8: System.out.println("August"); break;
    case 9: System.out.println("September"); break;
    case 10: System.out.println("October"); break;
    case 11: System.out.println("November"); break;
    case 12: System.out.println("December"); break;
    default: System.out.println("Invalid month");
}`,
      hint: "Use numbers 1-12 as cases and include a default case for invalid inputs"
    },
    exercise2: {
      title: "Day Type Classifier",
      description: "Create a switch statement to classify days as Weekday or Weekend",
      template: `public class DayClassifier {
    public static void main(String[] args) {
        String day = "MONDAY";
        // TODO: Classify the day using switch
    }
}`,
      solution: `switch(day.toUpperCase()) {
    case "MONDAY":
    case "TUESDAY":
    case "WEDNESDAY":
    case "THURSDAY":
    case "FRIDAY":
        System.out.println("Weekday");
        break;
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Invalid day");
}`,
      hint: "Use fall-through cases for days that share the same classification"
    },
    exercise3: {
      title: "Grade Calculator",
      description: "Create a switch statement to convert numeric grades to letter grades using ranges",
      template: `public class GradeConverter {
    public static void main(String[] args) {
        int score = 85;
        int grade = score / 10;
        // TODO: Convert to letter grade using switch
    }
}`,
      solution: `switch(grade) {
    case 10:
    case 9:
        System.out.println("A");
        break;
    case 8:
        System.out.println("B");
        break;
    case 7:
        System.out.println("C");
        break;
    case 6:
        System.out.println("D");
        break;
    default:
        System.out.println("F");
}`,
      hint: "Divide the score by 10 to work with ranges easily"
    },
    exercise4: {
      title: "Season Finder",
      description: "Create a switch statement to determine the season based on month number",
      template: `public class SeasonFinder {
    public static void main(String[] args) {
        int month = 6;
        // TODO: Determine season using switch
    }
}`,
      solution: `switch(month) {
    case 12:
    case 1:
    case 2:
        System.out.println("Winter");
        break;
    case 3:
    case 4:
    case 5:
        System.out.println("Spring");
        break;
    case 6:
    case 7:
    case 8:
        System.out.println("Summer");
        break;
    case 9:
    case 10:
    case 11:
        System.out.println("Fall");
        break;
    default:
        System.out.println("Invalid month");
}`,
      hint: "Group months by season using fall-through cases"
    }
  };

  const tryYourselfQuestions = (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-purple-400">Try It Yourself! 🚀</h2>
      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
        <p className="text-gray-300 mb-4">
          Practice your switch statement skills with these challenges:
        </p>
        <ol className="list-decimal list-inside space-y-4 text-gray-300">
          <li>Simple Calculator: Create a calculator using switch for basic operations (+, -, *, /)</li>
          <li>Traffic Light: Implement a traffic light system using switch</li>
          <li>Menu System: Create a menu-driven program using switch</li>
          <li>Number to Words: Convert single digits to words using switch</li>
          <li>Vowel Checker: Check if a character is a vowel using switch</li>
          <li>HTTP Status: Convert HTTP status codes to messages</li>
          <li>Currency Converter: Simple currency conversion menu</li>
          <li>Roman Numerals: Convert numbers 1-10 to Roman numerals</li>
          <li>Unit Converter: Length unit conversion menu</li>
          <li>Card Value: Convert card numbers to face values</li>
        </ol>
      </div>
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Practice Set: Switch Statements 🎯
      </h1>

      {/* MCQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Multiple Choice Questions</h2>
        {mcqQuestions.map((question) => (
          <MCQ
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id]}
            onAnswerSelect={(id, answer) => setSelectedAnswers(prev => ({...prev, [id]: answer}))}
          />
        ))}
      </section>

      {/* Coding Exercises Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Coding Exercises</h2>
        {Object.entries(codingExercises).map(([key, exercise]) => (
          <div key={key} className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <h3 className="text-xl font-semibold text-blue-400">{exercise.title}</h3>
            <p className="text-gray-300 mb-4">{exercise.description}</p>
            <CodeEditor code={exercise.template} />
            <Hint hint={exercise.hint} expanded={expandedHints[key]} onToggle={() => setExpandedHints(prev => ({...prev, [key]: !prev[key]}))} />
            <ViewSolution solution={exercise.solution} expanded={expandedSolutions[key]} onToggle={() => setExpandedSolutions(prev => ({...prev, [key]: !prev[key]}))} />
          </div>
        ))}
      </section>

      {/* Try Yourself Section */}
      {tryYourselfQuestions}
    </div>
  );
};

export default PracticeSetSwitch;
