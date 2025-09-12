import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const NestedWhileLoops = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicNested: {
      title: '🔄 Basic Nested While Loops',
      code: `public class BasicNestedWhile {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 3) {  // Outer loop
            int j = 1;
            while (j <= 3) {  // Inner loop
                System.out.print(i + "," + j + " ");
                j++;
            }
            System.out.println();  // New line after inner loop
            i++;
        }
    }
}
/* Output:
1,1 1,2 1,3 
2,1 2,2 2,3 
3,1 3,2 3,3 
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },
    patternExample: {
      title: '⭐ Pattern Using Nested While',
      code: `public class WhilePattern {
    public static void main(String[] args) {
        int rows = 4;
        int i = 1;
        
        while (i <= rows) {
            int j = 1;
            while (j <= i) {
                System.out.print("* ");
                j++;
            }
            System.out.println();
            i++;
        }
    }
}
/* Output:
* 
* * 
* * * 
* * * * 
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },
    matrixExample: {
      title: '🎲 Matrix Processing',
      code: `public class MatrixProcess {
    public static void main(String[] args) {
        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int i = 0;
        
        while (i < matrix.length) {
            int j = 0;
            while (j < matrix[i].length) {
                System.out.print(matrix[i][j] + " ");
                j++;
            }
            System.out.println();
            i++;
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const keyFeatures = [
    { icon: "🔄", text: "Loop within a loop" },
    { icon: "⚡", text: "Inner loop completes for each outer iteration" },
    { icon: "🎯", text: "Perfect for 2D data structures" }
  ];

  const useCases = [
    { icon: "🎲", text: "Matrix operations" },
    { icon: "⭐", text: "Pattern printing" },
    { icon: "🔍", text: "Complex data processing" }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Nested While Loop Structure",
      content: [
        "Outer loop controls major iterations",
        "Inner loop runs completely for each outer iteration",
        "Variables must be reinitialized for inner loop",
        "Useful for working with 2D structures"
      ],
      code: `int i = 1;
while (i <= n) {
    int j = 1;  // Reinitialize for each outer iteration
    while (j <= m) {
        // Process elements
        j++;
    }
    i++;
}`
    },
    {
      icon: "⚠️",
      title: "Common Applications",
      content: [
        "Processing 2D arrays",
        "Creating patterns",
        "Nested data structures",
        "Complex iterations"
      ],
      code: `// Processing a 2D array
while (row < array.length) {
    while (col < array[row].length) {
        process(array[row][col]);
        col++;
    }
    row++;
}`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "How many times does the inner loop execute for each outer loop iteration?",
      options: [
        "Once",
        "Depends on the inner loop condition",
        "Same as outer loop",
        "Random number of times"
      ],
      correctAnswer: 1,
      explanation: "Inner loop executes completely based on its condition for each outer loop iteration."
    },
    {
      id: 2,
      question: "What happens if you forget to increment the inner loop counter?",
      options: [
        "Outer loop continues",
        "Program crashes",
        "Inner loop becomes infinite",
        "Nothing happens"
      ],
      correctAnswer: 2,
      explanation: "Without incrementing the inner loop counter, it becomes an infinite loop."
    },
    {
      id: 3,
      question: "When should you use nested while loops over nested for loops?",
      options: [
        "Always",
        "Never",
        "When iteration count is unknown",
        "For better performance"
      ],
      correctAnswer: 2,
      explanation: "Nested while loops are preferred when the number of iterations isn't known in advance."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Nested While Loops in Java 🔄"
        description="Learn about nested while loops - a powerful construct for handling complex iterations and 2D data structures. Perfect for matrix operations and pattern printing."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Features 🎯"
          items={keyFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Common Use Cases 💡"
          items={useCases}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples and Usage 💻</h2>
        {Object.values(examples).map((example, index) => (
          <CodeSnippet key={index} {...example} />
        ))}
      </section>

      <MistakesToAvoid
        title="Common Nested While Loop Mistakes"
        mistakes={[
          "Forgetting to reinitialize inner loop variable",
          "Missing increment in either loop",
          "Wrong nesting structure",
          "Incorrect loop conditions"
        ]}
        alternatives={[
          "Reinitialize inner loop counter each time",
          "Always include increment statements",
          "Maintain proper nesting hierarchy",
          "Double-check loop conditions"
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
        title="Practice Exercise 💪"
        description="Create a multiplication table using nested while loops"
        defaultCode={`public class MultiplicationTable {
    public static void main(String[] args) {
        int size = 10;
        // Create a multiplication table using nested while loops
        // Output should show multiplication table up to 10x10
    }
}`}
      />

      <ImportantNote
        title="Key Points to Remember"
        points={[
          "Inner loop completes its iterations for each outer loop iteration",
          "Reinitialize inner loop counter for each outer iteration",
          "Maintain proper increment statements",
          "Use clear and meaningful variable names for each loop"
        ]}
      />
    </div>
  );
};

export default NestedWhileLoops;
