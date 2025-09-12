import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const BasicForLoop = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicSyntax: {
      title: '🎯 Basic For Loop Syntax',
      code: `public class BasicForLoop {
    public static void main(String[] args) {
        // Basic for loop structure
        for (int i = 0; i < 5; i++) {
            System.out.println("Count is: " + i);
        }
        
        /* Loop breakdown:
           initialization: int i = 0
           condition: i < 5
           increment: i++
        */
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    commonPatterns: {
      title: '🌟 Common For Loop Patterns',
      code: `public class LoopPatterns {
    public static void main(String[] args) {
        // Counting down
        for (int i = 10; i > 0; i--) {
            System.out.println(i);
        }
        
        // Step by 2
        for (int i = 0; i <= 10; i += 2) {
            System.out.println(i);
        }
        
        // Multiple variables
        for (int i = 0, j = 10; i < j; i++, j--) {
            System.out.println("i=" + i + ", j=" + j);
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const loopComponents = [
    { icon: "1️⃣", text: "Initialization (start)" },
    { icon: "2️⃣", text: "Condition (continue?)" },
    { icon: "3️⃣", text: "Update (change)" }
  ];

  const commonUses = [
    { icon: "🔄", text: "Iterating specific times" },
    { icon: "📦", text: "Processing arrays" },
    { icon: "🔍", text: "Search operations" }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Basic For Loop Structure",
      content: [
        "A for loop consists of three main parts:",
        "1. Initialization - where we start",
        "2. Condition - when to continue",
        "3. Update - how to change each time"
      ],
      code: `for (int i = 0; i < 5; i++) {
    // Code to repeat
}`
    },
    {
      icon: "⚡",
      title: "Loop Flow",
      content: [
        "1. Initialize counter variable",
        "2. Check condition",
        "3. Execute loop body if condition is true",
        "4. Update counter",
        "5. Repeat steps 2-4 until condition is false"
      ],
      code: `// Prints: 0 1 2 3 4
for (int i = 0; i < 5; i++) {
    System.out.print(i + " ");
}`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "Which part of a for loop is optional?",
      options: [
        "Initialization only",
        "Condition only",
        "Increment/Decrement only",
        "All parts are optional"
      ],
      correctAnswer: 3,
      explanation: "All three parts of a for loop (initialization, condition, increment/decrement) are optional in Java."
    },
    {
      id: 2,
      question: "What is the output of: for(int i=0; i<5; i++) { System.out.print(i); }",
      options: [
        "12345",
        "01234",
        "1234",
        "01235"
      ],
      correctAnswer: 1,
      explanation: "The loop prints numbers from 0 to 4, resulting in '01234'."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Basic For Loops in Java 🔄"
        description="For loops are one of the most commonly used control structures in Java. They allow you to execute a block of code repeatedly based on a condition. Let's master the basics! 🎯"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Loop Components 🔍"
          items={loopComponents}
          variant="blue"
        />
        <KeyFeatures
          title="Common Uses 🎯"
          items={commonUses}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicSyntax} />
        <CodeSnippet {...examples.commonPatterns} />
      </section>

      <MistakesToAvoid
        title="Common Mistakes"
        mistakes={[
          "Using comma instead of semicolon in for loop syntax",
          "Forgetting to update the loop variable",
          "Creating infinite loops with wrong conditions",
          "Using wrong comparison operators"
        ]}
        alternatives={[
          "Use semicolons to separate loop components",
          "Always include counter update statement",
          "Double-check loop conditions",
          "Test with small numbers first"
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
        description="Create a program that prints the first 10 even numbers using a for loop"
        defaultCode={`public class EvenNumbers {
    public static void main(String[] args) {
        // Write your for loop here to print first 10 even numbers
        // Expected output: 2 4 6 8 10 12 14 16 18 20
    }
}`}
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these key points about for loops:
          • Three main components: initialization, condition, update
          • Components are separated by semicolons
          • Loop body executes while condition is true
          • Counter variable usually named 'i'
          • Great for known number of iterations
        `}
        variant="green"
      />
    </div>
  );
};

export default BasicForLoop;
