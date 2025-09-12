import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const WhileLoopBasics = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicSyntax: {
      title: '🔄 Basic While Loop Syntax',
      code: `public class WhileLoopDemo {
    public static void main(String[] args) {
        int count = 1;  // Initialization
        
        while (count <= 5) {  // Condition
            System.out.println("Count is: " + count);
            count++;  // Update
        }
        
        System.out.println("Loop finished!");
    }
}
/* Output:
Count is: 1
Count is: 2
Count is: 3
Count is: 4
Count is: 5
Loop finished!
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },
    comparisonWithFor: {
      title: '🔄 While vs For Loop',
      code: `public class LoopComparison {
    public static void main(String[] args) {
        // Using while loop
        int i = 0;
        while (i < 3) {
            System.out.println("While: " + i);
            i++;
        }
        
        // Equivalent for loop
        for (int j = 0; j < 3; j++) {
            System.out.println("For: " + j);
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    userInput: {
      title: '⌨️ While Loop with User Input',
      code: `import java.util.Scanner;

public class InputLoop {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        
        while (sum < 100) {
            System.out.print("Enter a number: ");
            int number = scanner.nextInt();
            sum += number;
            System.out.println("Current sum: " + sum);
        }
        
        System.out.println("Sum exceeded 100!");
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const keyFeatures = [
    { icon: "🔄", text: "Entry controlled loop" },
    { icon: "⚡", text: "Condition checked first" },
    { icon: "🎯", text: "Flexible iteration count" }
  ];

  const useCases = [
    { icon: "⌨️", text: "User input validation" },
    { icon: "🔍", text: "Unknown iteration count" },
    { icon: "📝", text: "File processing" }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "While Loop Structure",
      content: [
        "Initialization before the loop",
        "Condition checked at the start",
        "Update statement inside the loop",
        "Body executes while condition is true"
      ],
      code: `int i = 1;           // Initialization
while (i <= 5) {      // Condition
    // Loop body
    i++;              // Update
}`
    },
    {
      icon: "⚠️",
      title: "Common Use Cases",
      content: [
        "Reading input until a specific condition",
        "Processing data with unknown size",
        "Game loops",
        "Menu-driven programs"
      ],
      code: `Scanner scanner = new Scanner(System.in);
String input = "";
while (!input.equals("quit")) {
    input = scanner.nextLine();
    // Process input
}`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "When is a while loop most appropriate?",
      options: [
        "When you know the exact number of iterations",
        "When the number of iterations is unknown",
        "When working with arrays only",
        "When using recursion"
      ],
      correctAnswer: 1,
      explanation: "While loops are best when the number of iterations isn't known in advance."
    },
    {
      id: 2,
      question: "What happens if you forget to update the loop variable?",
      options: [
        "Compilation error",
        "Runtime error",
        "Infinite loop",
        "Loop executes once"
      ],
      correctAnswer: 2,
      explanation: "Without updating the loop variable, the condition remains true, causing an infinite loop."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="While Loop Basics in Java 🔄"
        description="Learn about while loops - the fundamental loop structure for situations where the number of iterations isn't known in advance. Perfect for input validation, file processing, and menu-driven programs."
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
        title="Common While Loop Mistakes"
        mistakes={[
          "Forgetting to initialize variables",
          "Missing update statement",
          "Wrong condition leading to infinite loop",
          "Not handling edge cases"
        ]}
        alternatives={[
          "Initialize before the loop",
          "Always include update statement",
          "Double-check loop conditions",
          "Test with boundary values"
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
        description="Create a number guessing game using a while loop"
        defaultCode={`import java.util.Scanner;

public class GuessingGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int secretNumber = 42;
        // Add your code here to create a number guessing game
    }
}`}
      />

      <ImportantNote
        title="Key Points to Remember"
        points={[
          "While loops check the condition before executing the body",
          "Always ensure there's a way to exit the loop",
          "Initialize variables before the loop starts",
          "Update variables inside the loop body"
        ]}
      />
    </div>
  );
};

export default WhileLoopBasics;
