import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const DoWhileLoop = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicSyntax: {
      title: '🔄 Do-While Loop Basics',
      code: `public class DoWhileDemo {
    public static void main(String[] args) {
        int count = 1;
        
        do {
            System.out.println("Count is: " + count);
            count++;
        } while (count <= 5);
        
        // Even if condition is false initially,
        // loop executes at least once
        int x = 10;
        do {
            System.out.println("This prints once!");
        } while (x < 5);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    menuExample: {
      title: '📋 Menu-Driven Program',
      code: `import java.util.Scanner;

public class MenuProgram {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;
        
        do {
            System.out.println("\\nMenu:");
            System.out.println("1. Add");
            System.out.println("2. Subtract");
            System.out.println("3. Exit");
            System.out.print("Enter choice: ");
            
            choice = scanner.nextInt();
            
            switch(choice) {
                case 1: System.out.println("Addition selected"); break;
                case 2: System.out.println("Subtraction selected"); break;
                case 3: System.out.println("Exiting..."); break;
                default: System.out.println("Invalid choice!");
            }
        } while (choice != 3);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const keyFeatures = [
    { icon: "🔄", text: "Exit controlled loop" },
    { icon: "✨", text: "Executes at least once" },
    { icon: "🎯", text: "Condition checked at end" }
  ];

  const useCases = [
    { icon: "📋", text: "Menu-driven programs" },
    { icon: "⌨️", text: "Input validation" },
    { icon: "🔄", text: "Game loops" }
  ];

  const conceptSections = [
    {
      icon: "🔍",
      title: "Do-While vs While Loop",
      content: [
        "While loop checks condition first",
        "Do-while executes code first",
        "Do-while guarantees at least one execution",
        "Use when code must run at least once"
      ],
      code: `// While loop
while (condition) {
    // May never execute
}

// Do-while loop
do {
    // Always executes at least once
} while (condition);`
    },
    {
      icon: "💡",
      title: "Common Applications",
      content: [
        "Input validation loops",
        "Menu-driven programs",
        "Game loops",
        "User interaction scenarios"
      ],
      code: `do {
    userInput = getUserInput();
    processInput(userInput);
} while (!isValid(userInput));`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "What's the main difference between while and do-while loops?",
      options: [
        "Syntax only",
        "Do-while executes at least once",
        "While loop is faster",
        "Do-while uses less memory"
      ],
      correctAnswer: 1,
      explanation: "Do-while loop always executes at least once before checking the condition."
    },
    {
      id: 2,
      question: "When is a do-while loop most appropriate?",
      options: [
        "When iterating arrays",
        "When condition must be checked first",
        "When code must execute at least once",
        "When using break statements"
      ],
      correctAnswer: 2,
      explanation: "Do-while is best when code needs to execute at least once before checking condition."
    },
    {
      id: 3,
      question: "What happens if condition is false initially in a do-while loop?",
      options: [
        "Loop never executes",
        "Loop executes once",
        "Compilation error",
        "Runtime error"
      ],
      correctAnswer: 1,
      explanation: "Even with a false condition, do-while loop executes once before checking."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Do-While Loop in Java 🔄"
        description="Learn about do-while loops - the exit-controlled loop that ensures at least one execution. Perfect for menu-driven programs and input validation scenarios."
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
        title="Common Do-While Loop Mistakes"
        mistakes={[
          "Forgetting semicolon after while condition",
          "Infinite loop due to condition never changing",
          "Using when while loop is more appropriate",
          "Not considering first execution guarantee"
        ]}
        alternatives={[
          "Always add semicolon after while(condition)",
          "Ensure condition can change inside loop",
          "Use while when pre-check is needed",
          "Consider if guaranteed execution is needed"
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
        description="Create a number guessing game that asks user to play again after each round"
        defaultCode={`import java.util.Scanner;

public class GuessingGameWithReplay {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char playAgain;
        
        // Add your code here to create a guessing game
        // with replay option using do-while loop
    }
}`}
      />

      <ImportantNote
        title="Key Points to Remember"
        points={[
          "Do-while loop always executes at least once",
          "Condition is checked after loop body",
          "Semicolon is required after while condition",
          "Perfect for input validation scenarios"
        ]}
      />
    </div>
  );
};

export default DoWhileLoop;
