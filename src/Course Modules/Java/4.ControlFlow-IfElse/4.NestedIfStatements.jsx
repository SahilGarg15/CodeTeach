import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const NestedIfStatements = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🎯 Basic Nested If Structure',
      code: `public class NestedIfDemo {
    public static void main(String[] args) {
        int age = 20;
        boolean hasLicense = true;
        
        if (age >= 18) {
            System.out.println("Age requirement met!");
            if (hasLicense) {
                System.out.println("You can drive!");
            }
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    practicalExample: {
      title: '🌟 Real World Example',
      code: `public class OnlineShop {
    public static void main(String[] args) {
        boolean isLoggedIn = true;
        double cartTotal = 1000.0;
        boolean isPremiumMember = true;
        
        if (isLoggedIn) {
            if (cartTotal > 500.0) {
                if (isPremiumMember) {
                    System.out.println("20% Premium Discount Applied!");
                } else {
                    System.out.println("10% Regular Discount Applied!");
                }
            } else {
                System.out.println("Add more items for discount!");
            }
        } else {
            System.out.println("Please log in first!");
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
      question: "What happens when an inner if condition is false in nested if statements?",
      options: [
        "All outer if statements are skipped",
        "Only the inner if block is skipped",
        "The program terminates",
        "The next else statement executes"
      ],
      correctAnswer: 1,
      explanation: "When an inner if condition is false, only that specific if block is skipped. The outer if statements and their code blocks continue to execute normally."
    },
    {
      id: 2,
      question: "What is the maximum number of nesting levels allowed in Java?",
      options: [
        "Only 2 levels",
        "Maximum 5 levels",
        "No technical limit, but should be limited for readability",
        "Exactly 3 levels"
      ],
      correctAnswer: 2,
      explanation: "Java doesn't impose a technical limit on nesting levels, but it's recommended to limit nesting to 2-3 levels for code readability and maintainability."
    }
  ];

  const conceptSections = [
    {
      icon: "📦",
      title: "Understanding Nested If",
      content: [
        "Nested if statements allow you to test multiple conditions in a hierarchical manner.",
        "Each inner if statement represents a more specific condition that depends on the outer condition."
      ],
      code: `if (outerCondition) {
    // outer code
    if (innerCondition) {
        // inner code
    }
}`
    },
    {
      icon: "🎯",
      title: "Control Flow",
      content: [
        "Inner conditions are only evaluated when outer conditions are true.",
        "This creates a logical hierarchy of decision-making in your code."
      ],
      code: `if (age >= 18) {
    if (hasLicense) {
        // Only reached if both conditions are true
    }
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Nested If Statements in Java 📦"
        description="Nested if statements are like Russian nesting dolls - one if statement inside another! They help you check multiple conditions in a hierarchical way. 🪆"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Concepts 📌"
          items={[
            { icon: "📦", text: "Multiple levels of conditions" },
            { icon: "🎯", text: "Hierarchical decision making" },
            { icon: "🔄", text: "Independent conditions" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Best Practices 🎯"
          items={[
            { icon: "📝", text: "Limit nesting levels (2-3 max)" },
            { icon: "🎨", text: "Use proper indentation" },
            { icon: "✨", text: "Consider alternatives for deep nesting" }
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
        title="Nesting Depth Warning"
        points={[
          "While you can nest if statements as deep as you want, too much nesting can make your code:",
          "Hard to read and understand",
          "Difficult to maintain",
          "More prone to errors",
          "Complex to debug"
        ]}
        variant="yellow"
      />

      <MistakesToAvoid
        title="Common Mistakes to Avoid"
        mistakes={[
          "Forgetting to match braces correctly",
          "Poor indentation making code hard to read",
          "Too many levels of nesting",
          "Not considering alternative approaches"
        ]}
        alternatives={[
          "Use && operators instead of deep nesting",
          "Break complex nested conditions into separate methods",
          "Use early returns to reduce nesting",
          "Consider using switch statements when applicable"
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
        description="Write a program that checks if a user can vote based on age (18+) and whether they have valid ID (true/false)"
        defaultCode={`public class VotingEligibility {
    public static void main(String[] args) {
        int age = 19;
        boolean hasValidID = true;
        
        // Write your nested if statements here
        
    }
}`}
      />
    </div>
  );
};

export default NestedIfStatements;
