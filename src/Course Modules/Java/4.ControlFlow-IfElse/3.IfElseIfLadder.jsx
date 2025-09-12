import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const IfElseIfLadder = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🏗️ If-Else-If Ladder Structure',
      code: `public class GradeSystem {
    public static void main(String[] args) {
        int score = 85;
        
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else if (score >= 70) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    practicalExample: {
      title: '🎯 Real World Example',
      code: `public class WeatherAdvice {
    public static void main(String[] args) {
        double temperature = 25.5;
        
        if (temperature > 30) {
            System.out.println("It's hot! Stay hydrated!");
        } else if (temperature > 20) {
            System.out.println("Pleasant weather!");
        } else if (temperature > 10) {
            System.out.println("Bring a jacket!");
        } else {
            System.out.println("It's cold! Stay warm!");
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
      question: "In an if-else-if ladder, how many conditions can be executed?",
      options: [
        "All conditions that are true",
        "Only the first condition that is true",
        "Only the last condition",
        "All conditions regardless of truth value"
      ],
      correctAnswer: 1,
      explanation: "In an if-else-if ladder, only the first condition that evaluates to true will have its code block executed. Once a condition is true, the rest of the ladder is skipped."
    },
    {
      id: 2,
      question: "What happens if none of the conditions in the if-else-if ladder are true?",
      options: [
        "The program crashes",
        "All code blocks are skipped",
        "The else block executes (if present)",
        "The first condition executes by default"
      ],
      correctAnswer: 2,
      explanation: "If none of the conditions are true and there is an else block, the else block will execute. If there is no else block, all code blocks are skipped."
    }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "If-Else-If Flow",
      content: [
        "The if-else-if ladder evaluates conditions in sequence until a true condition is found.",
        "Once a condition is true, its code block executes and the rest of the ladder is skipped."
      ],
      code: `if (condition1) {
    // code for condition1
} else if (condition2) {
    // code for condition2
} else {
    // default code
}`
    },
    {
      icon: "⚡",
      title: "Order Matters",
      content: [
        "Conditions are tested from top to bottom.",
        "More specific conditions should come before general ones to avoid logical errors."
      ],
      code: `if (score >= 90) {     // More specific
    grade = "A";
} else if (score >= 80) { // Less specific
    grade = "B";
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="If-Else-If Ladder in Java 🪜"
        description="The if-else-if ladder allows you to test multiple conditions in sequence, like a decision tree. It's perfect for handling multiple possible scenarios! 🌳"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Features 📌"
          items={[
            { icon: "🎯", text: "Multiple conditions" },
            { icon: "⚡", text: "Sequential testing" },
            { icon: "🔄", text: "Optional else block" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Important Points 🤔"
          items={[
            { icon: "1️⃣", text: "Only first true condition executes" },
            { icon: "📝", text: "Order matters" },
            { icon: "🎯", text: "Conditions are tested in sequence" }
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
        title="Pro Tips"
        points={[
          "Order conditions from most specific to most general",
          "Use else as a catch-all for unexpected cases",
          "Keep conditions mutually exclusive"
        ]}
        variant="yellow"
      />

      <MistakesToAvoid
        title="Watch Out For"
        mistakes={[
          "Incorrect order of conditions",
          "Overlapping conditions",
          "Missing else block for default case",
          "Using = instead of == for comparison"
        ]}
        alternatives={[
          "Use clear, descriptive condition checks",
          "Consider switch statements for equality comparisons",
          "Use early returns for simpler flow",
          "Break complex conditions into boolean methods"
        ]}
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
        description="Write a program that assigns letter grades based on scores: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60)"
        defaultCode={`public class GradingSystem {
    public static void main(String[] args) {
        int score = 85;
        
        // Write your if-else-if ladder here
        
    }
}`}
      />
    </div>
  );
};

export default IfElseIfLadder;
