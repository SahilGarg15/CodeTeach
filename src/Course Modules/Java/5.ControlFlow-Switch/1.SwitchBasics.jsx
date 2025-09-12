import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const SwitchBasics = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🎯 Basic Switch Structure',
      code: `public class SwitchDemo {
    public static void main(String[] args) {
        int day = 3;
        
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            default:
                System.out.println("Other day");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    practicalExample: {
      title: '🌟 Real World Example',
      code: `public class GradeCalculator {
    public static void main(String[] args) {
        char grade = 'B';
        
        switch (grade) {
            case 'A':
                System.out.println("Excellent!");
                break;
            case 'B':
                System.out.println("Good job!");
                break;
            case 'C':
                System.out.println("Satisfactory");
                break;
            default:
                System.out.println("Needs improvement");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const mcqQuestions = [
    {
      id: 1,
      question: "What happens if you forget to use 'break' in a switch case?",
      options: [
        "The program will not compile",
        "The program will throw an error at runtime",
        "Fall-through: execution continues to next case",
        "The switch statement will end immediately"
      ],
      correctAnswer: 2,
      explanation: "Without a break statement, the code will 'fall through' to the next case, executing all subsequent cases until a break is encountered or the switch ends."
    },
    {
      id: 2,
      question: "Which of these cannot be used as a switch expression in Java?",
      options: [
        "int",
        "String",
        "float",
        "char"
      ],
      correctAnswer: 2,
      explanation: "float (and double) cannot be used as switch expressions. Only int, byte, short, char, enum, String, and their wrapper classes are allowed."
    }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Switch Statement Structure",
      content: [
        "A switch statement tests a variable against multiple possible values.",
        "Each case represents a possible value and contains code to execute when matched."
      ],
      code: `switch (variable) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // default code
}`
    },
    {
      icon: "⚡",
      title: "Break Statement",
      content: [
        "The break statement is crucial in switch statements to prevent fall-through execution.",
        "Without break, execution continues into subsequent cases regardless of their values."
      ],
      code: `case 1: // Without break
    System.out.println("One");
    // Falls through to case 2
case 2:
    System.out.println("Two"); // Both will print`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Switch Statement Basics in Java 🔄"
        description="The switch statement is a multi-way branch statement that provides an easy way to dispatch execution to different parts of code based on the value of an expression. 🎯"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Components 🔑"
          items={[
            { icon: "🎯", text: "Switch expression" },
            { icon: "📦", text: "Case statements" },
            { icon: "🔄", text: "Break statements" },
            { icon: "⚡", text: "Default case" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Supported Types 📋"
          items={[
            { icon: "🔢", text: "Primitive types (byte, short, char, int)" },
            { icon: "📝", text: "String (Java 7+)" },
            { icon: "🔰", text: "Enum types" }
          ]}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicStructure} />
        <CodeSnippet {...examples.practicalExample} />
      </section>

      <ImportantNote
        title="Common Pitfalls"
        points={[
          "Forgetting break statements",
          "Using non-supported types",
          "Duplicate case values",
          "Missing default case"
        ]}
        variant="yellow"
      />

      <ImportantNote
        title="Best Practices"
        points={[
          "Always include a default case",
          "Use break statements consistently",
          "Consider using enhanced switch (Java 14+)",
          "Keep cases simple and readable"
        ]}
        variant="blue"
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Test Your Understanding 🤓</h2>
        {mcqQuestions.map((question) => (
          <MCQ
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id]}
            onAnswerSelect={(id, answer) => setSelectedAnswers(prev => ({...prev, [id]: answer}))}
          />
        ))}
      </section>

      <HandsOn
        title="Practice Time! 💻"
        description="Create a simple calculator using switch statement that performs basic operations (+, -, *, /)"
        defaultCode={`public class Calculator {
    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 5;
        char operator = '+';
        
        // Write your switch statement here
        
    }
}`}
      />
    </div>
  );
};

export default SwitchBasics;
