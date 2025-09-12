import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const IfElseStatement = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🏗️ If-Else Structure',
      code: `public class IfElseStructure {
    public static void main(String[] args) {
        // Basic if-else statement structure
        if (condition) {
            // Code to execute if condition is true
        } else {
            // Code to execute if condition is false
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    simpleExample: {
      title: '👶 Simple Example',
      code: `public class AgeCheck {
    public static void main(String[] args) {
        int age = 15;
        
        if (age >= 18) {
            System.out.println("You are an adult!");
        } else {
            System.out.println("You are a minor!");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    practicalExample: {
      title: '🎯 Practical Example',
      code: `public class GradeChecker {
    public static void main(String[] args) {
        int score = 75;
        
        if (score >= 50) {
            System.out.println("Pass! 🎉");
        } else {
            System.out.println("Try again! 💪");
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
      question: "In an if-else statement, when is the else block executed?",
      options: [
        "When the if condition is true",
        "When the if condition is false",
        "Always executed regardless of condition",
        "Never executed"
      ],
      correctAnswer: 1,
      explanation: "The else block only executes when the if condition evaluates to false. This provides an alternative path for the code execution."
    },
    {
      id: 2,
      question: "What happens if you omit the curly braces {} in an if-else statement with multiple lines?",
      options: [
        "All lines will be executed",
        "Only the first line after if/else will be considered part of the block",
        "The code won't compile",
        "The code will throw an error at runtime"
      ],
      correctAnswer: 1,
      explanation: "Without curly braces, only the first line after if/else is considered part of the conditional block. It's recommended to always use curly braces to avoid confusion."
    }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Basic Structure",
      content: [
        "If-else statements provide two different execution paths based on a condition.",
        "The condition is evaluated once, and either the if block or else block executes."
      ],
      code: `if (condition) {
    // code when true
} else {
    // code when false
}`
    },
    {
      icon: "⚡",
      title: "Flow Control",
      content: [
        "Only one block of code executes - never both.",
        "The else block is optional and provides an alternative path."
      ],
      code: `if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="If-Else Statements in Java 🔄"
        description="If-else statements extend the if statement by providing an alternative path when the condition is false. Think of it as having a Plan B! 🎯"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Components 📌"
          items={[
            { icon: "🎯", text: "If Block (primary path)" },
            { icon: "🔄", text: "Else Block (alternative path)" },
            { icon: "⚡", text: "Condition (decides the path)" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Remember 🤔"
          items={[
            { icon: "✨", text: "Only one block executes" },
            { icon: "🎨", text: "Else is optional" },
            { icon: "📝", text: "Use {} for multiple statements" }
          ]}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Structure and Examples 🏗️</h2>
        <CodeSnippet {...examples.basicStructure} />
        <CodeSnippet {...examples.simpleExample} />
        <CodeSnippet {...examples.practicalExample} />
      </section>

      <MistakesToAvoid
        title="Watch Out For"
        mistakes={[
          "Don't put semicolon after if condition",
          "Always match each else with the nearest if",
          "Use proper indentation for readability",
          "Don't forget curly braces for multiple statements"
        ]}
        alternatives={[
          "Use consistent formatting",
          "Consider extracting complex conditions into boolean methods",
          "Use meaningful condition names",
          "Keep conditions simple and readable"
        ]}
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Check Your Understanding 🤓</h2>
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
        description="Write a program that checks if a number is even or odd using if-else statement"
        defaultCode={`public class EvenOddChecker {
    public static void main(String[] args) {
        int number = 7;
        
        // Write your if-else statement here
        
    }
}`}
      />
    </div>
  );
};

export default IfElseStatement;
