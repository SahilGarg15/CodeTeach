import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const EnhancedSwitch = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🎯 Enhanced Switch Example (Java 14+)',
      code: `public class EnhancedSwitchDemo {
    public static void main(String[] args) {
        String day = "MONDAY";
        
        String type = switch (day) {
            case "MONDAY", "TUESDAY", "WEDNESDAY", 
                 "THURSDAY", "FRIDAY" -> "Weekday";
            case "SATURDAY", "SUNDAY" -> "Weekend";
            default -> "Invalid day";
        };
        
        System.out.println(type);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    yieldExample: {
      title: '🌟 Switch Expression with yield',
      code: `public class YieldExample {
    public static void main(String[] args) {
        int score = 85;
        
        String grade = switch (score / 10) {
            case 10, 9 -> {
                System.out.println("Excellent!");
                yield "A";
            }
            case 8 -> {
                System.out.println("Very Good!";
                yield "B";
            }
            case 7 -> "C";
            case 6 -> "D";
            default -> "F";
        };
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const mcqQuestions = [
    {
      id: 1,
      question: "Which Java version introduced the enhanced switch expressions?",
      options: [
        "Java 11",
        "Java 12",
        "Java 14",
        "Java 16"
      ],
      correctAnswer: 2,
      explanation: "Enhanced switch expressions were introduced as a standard feature in Java 14."
    },
    {
      id: 2,
      question: "What keyword is used to return a value from a switch expression block?",
      options: [
        "return",
        "break",
        "yield",
        "case"
      ],
      correctAnswer: 2,
      explanation: "The 'yield' keyword is used to return a value from a switch expression block."
    }
  ];

  const conceptSections = [
    {
      icon: "🎯",
      title: "Basic Syntax",
      content: [
        "Enhanced switch expressions introduce a more concise syntax using the arrow operator (->). This eliminates the need for break statements and makes the code more readable.",
        "You can group multiple cases together using commas, which is particularly useful when different cases should yield the same result."
      ],
      code: `case "MONDAY", "TUESDAY" -> "Weekday"`
    },
    {
      icon: "🔄",
      title: "Expression vs Statement",
      content: [
        "Unlike traditional switch statements, enhanced switch can be used as an expression that returns a value.",
        "The compiler ensures that all possible cases are handled, making the code more robust and preventing potential runtime errors."
      ],
      code: `String result = switch(value) {
    case 1 -> "One";
    case 2 -> "Two";
    default -> "Other";
};`
    },
    {
      icon: "⚡",
      title: "Using yield",
      content: [
        "When you need to execute multiple statements in a case, you can use a block with the yield keyword to return a value.",
        "The yield statement is similar to return but specifically designed for switch expressions."
      ],
      code: `case 1 -> {
    System.out.println("Processing...");
    yield "Result";
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Enhanced Switch Expressions 🚀"
        description="Java 14 introduced enhanced switch expressions with arrow syntax and multiple case labels, making switch statements more concise and powerful! Let's explore these modern features. 🎯"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="New Features 🆕"
          items={[
            { icon: "➡️", text: "Arrow syntax" },
            { icon: "📦", text: "Multiple case labels" },
            { icon: "🎯", text: "Expression form" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Advantages ✨"
          items={[
            { icon: "📝", text: "More concise syntax" },
            { icon: "🔄", text: "No break statements needed" },
            { icon: "✅", text: "Exhaustiveness checking" }
          ]}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicStructure} />
        <CodeSnippet {...examples.yieldExample} />
      </section>

      <ImportantNote
        title="Important Notes"
        points={[
          "Enhanced switch requires Java 14 or later",
          "Arrow syntax eliminates need for break statements",
          "Multiple case labels must be comma-separated",
          "Switch expressions must be exhaustive"
        ]}
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Test Your Knowledge 🤓</h2>
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
        title="Practice Exercise 💻"
        description="Create an enhanced switch expression to convert numerical grades to letter grades"
        defaultCode={`public class GradeConverter {
    public static void main(String[] args) {
        int score = 87;
        
        // Create an enhanced switch expression that returns:
        // A for scores 90-100
        // B for scores 80-89
        // C for scores 70-79
        // D for scores 60-69
        // F for scores below 60
        
    }
}`}
      />
    </div>
  );
};

export default EnhancedSwitch;
