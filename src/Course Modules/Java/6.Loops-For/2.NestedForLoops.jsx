import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const NestedForLoops = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicNested: {
      title: '🎯 Basic Nested Loop Example',
      code: `public class NestedLoopDemo {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.println("i: " + i + ", j: " + j);
            }
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    patternExample: {
      title: '🌟 Pattern Printing Example',
      code: `public class PatternDemo {
    public static void main(String[] args) {
        int rows = 5;
        // Print triangle pattern
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    multiplicationTable: {
      title: '📊 Multiplication Table',
      code: `public class MultiplicationTable {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= 5; j++) {
                System.out.printf("%4d", i * j);
            }
            System.out.println();
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const keyConcepts = [
    { icon: "🔄", text: "Outer & Inner Loops" },
    { icon: "📊", text: "Loop Dependencies" },
    { icon: "⚡", text: "Iteration Order" }
  ];

  const commonUses = [
    { icon: "🎨", text: "Pattern Printing" },
    { icon: "📱", text: "Matrix Operations" },
    { icon: "🔍", text: "Grid Processing" }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Understanding Nested Loops",
      content: [
        "Nested loops are loops within loops",
        "The inner loop completes all its iterations for each iteration of the outer loop",
        "Total iterations = outer loop iterations × inner loop iterations"
      ],
      code: `for (int i = 1; i <= 3; i++) {    // Outer loop
    for (int j = 1; j <= 2; j++) {  // Inner loop
        // Executes 6 times (3 × 2)
    }
}`
    },
    {
      icon: "🎯",
      title: "Loop Control Flow",
      content: [
        "Outer loop controls the number of rows/iterations",
        "Inner loop controls elements within each row/iteration",
        "Variables i and j are commonly used for outer and inner loops"
      ],
      code: `// Prints:
// * * *
// * * *
// * * *
for (int i = 1; i <= 3; i++) {      // Rows
    for (int j = 1; j <= 3; j++) {  // Columns
        System.out.print("* ");
    }
    System.out.println();  // New line after each row
}`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "How many times will the inner loop execute in total for: outer(3 iterations) * inner(4 iterations)?",
      options: [
        "3 times",
        "4 times",
        "7 times",
        "12 times"
      ],
      correctAnswer: 3,
      explanation: "The inner loop executes completely for each outer loop iteration: 3 * 4 = 12 times total."
    },
    {
      id: 2,
      question: "What is the output of this nested loop?\nfor(int i=1; i<=2; i++)\n  for(int j=1; j<=2; j++)\n    System.out.print(i+j);",
      options: [
        "2234",
        "2344",
        "2333",
        "2444"
      ],
      correctAnswer: 0,
      explanation: "For i=1: j=1(2) j=2(3), For i=2: j=1(3) j=2(4), So output is 2234"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Nested For Loops in Java 🔄"
        description="Nested loops are loops within loops, powerful for working with 2D patterns, matrices, and complex iterations. Master them to solve advanced programming challenges! 🎯"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Concepts 🔑"
          items={keyConcepts}
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
        <CodeSnippet {...examples.basicNested} />
        <CodeSnippet {...examples.patternExample} />
        <CodeSnippet {...examples.multiplicationTable} />
      </section>

      <MistakesToAvoid
        title="Common Mistakes"
        mistakes={[
          "Using same variable name in nested loops",
          "Incorrect loop termination conditions",
          "Not understanding iteration order",
          "Creating infinite nested loops"
        ]}
        alternatives={[
          "Use different variable names (i, j, k)",
          "Draw the pattern on paper first",
          "Start with small numbers to test",
          "Print debug statements to track flow"
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
        description="Create a program that prints a number pyramid pattern using nested loops"
        defaultCode={`public class NumberPyramid {
    public static void main(String[] args) {
        int rows = 5;
        // Create a pyramid pattern like:
        //     1
        //    121
        //   12321
        //  1234321
        // 123454321
    }
}`}
      />

      <ImportantNote
        title="Tips for Success"
        points={[
          "Start with simple patterns and work up to complex ones",
          "Use paper to draw the pattern first",
          "Count rows and columns carefully",
          "Test with different input sizes",
          "Pay attention to spaces in patterns"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these key points about nested loops:
          • Inner loop completes fully for each outer loop iteration
          • Total iterations = outer × inner iterations
          • Great for working with 2D patterns and matrices
          • Use different variables for each loop level
          • Plan your pattern on paper first
        `}
        variant="green"
      />
    </div>
  );
};

export default NestedForLoops;
