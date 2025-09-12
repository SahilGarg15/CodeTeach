import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const BreakStatement = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicBreak: {
      title: '🛑 Basic Break Statement',
      code: `public class BasicBreakDemo {
    public static void main(String[] args) {
        int sum = 0;
        while (true) {  // Infinite loop
            sum += 5;
            if (sum > 20) {
                break;  // Exits loop when sum exceeds 20
            }
            System.out.println("Sum is: " + sum);
        }
        System.out.println("Loop ended. Final sum: " + sum);
    }
}
/* Output:
Sum is: 5
Sum is: 10
Sum is: 15
Sum is: 20
Loop ended. Final sum: 25
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },
    labeledBreak: {
      title: '🏷️ Labeled Break Statement',
      code: `public class LabeledBreakDemo {
    public static void main(String[] args) {
        outer: while (true) {
            int count = 0;
            while (true) {
                count++;
                if (count > 3) {
                    break outer;  // Breaks outer loop
                }
                System.out.println("Inner count: " + count);
            }
            System.out.println("This won't print");
        }
        System.out.println("Both loops exited");
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    searchExample: {
      title: '🔍 Array Search with Break',
      code: `public class SearchArray {
    public static void main(String[] args) {
        int[] numbers = {4, 8, 15, 16, 23, 42};
        int target = 16;
        int index = -1;
        
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) {
                index = i;
                break;  // Stop searching once found
            }
        }
        
        if (index != -1) {
            System.out.println("Found at index: " + index);
        } else {
            System.out.println("Not found");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const keyFeatures = [
    { icon: "🛑", text: "Immediately exits loop" },
    { icon: "🏷️", text: "Can use with labels" },
    { icon: "🎯", text: "Works with any loop type" }
  ];

  const useCases = [
    { icon: "🔍", text: "Search algorithms" },
    { icon: "⚡", text: "Early termination" },
    { icon: "🎮", text: "Game loops" }
  ];

  const conceptSections = [
    {
      icon: "🛑",
      title: "Break Statement Basics",
      content: [
        "Immediately terminates loop execution",
        "Can exit from any type of loop",
        "Useful for early termination conditions",
        "Control passes to statement after loop"
      ],
      code: `while (condition) {
    if (someCondition) {
        break;  // Exit loop immediately
    }
    // Loop body
}`
    },
    {
      icon: "🏷️",
      title: "Labeled Break",
      content: [
        "Can break from nested loops",
        "Labels specify which loop to exit",
        "Must be valid Java identifier",
        "Useful for complex loop structures"
      ],
      code: `outerLoop: while (true) {
    while (true) {
        if (condition) {
            break outerLoop;  // Exit both loops
        }
    }
}`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "What happens when a break statement is executed?",
      options: [
        "Skips current iteration",
        "Exits program",
        "Exits current loop",
        "Throws exception"
      ],
      correctAnswer: 2,
      explanation: "Break statement immediately terminates the current loop execution."
    },
    {
      id: 2,
      question: "Which statement about labeled break is true?",
      options: [
        "Can only break inner loops",
        "Can break multiple loops at once",
        "Labels must be numbers",
        "Cannot use with while loops"
      ],
      correctAnswer: 1,
      explanation: "Labeled break can exit multiple nested loops at once using a label."
    },
    {
      id: 3,
      question: "Where can break statement be used?",
      options: [
        "Only in for loops",
        "Only in while loops",
        "In any loop or switch",
        "Only in if statements"
      ],
      correctAnswer: 2,
      explanation: "Break statement can be used in any loop type (for, while, do-while) or switch statement."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Break Statement in Java 🛑"
        description="Learn about the break statement - a powerful control flow tool that allows you to exit loops immediately. Perfect for search algorithms and early termination scenarios."
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
        title="Common Break Statement Mistakes"
        mistakes={[
          "Using break outside loops/switch",
          "Forgetting loop labels",
          "Breaking wrong loop",
          "Unreachable code after break"
        ]}
        alternatives={[
          "Only use break in loops or switch",
          "Label nested loops when needed",
          "Verify which loop is being broken",
          "Check code flow after break"
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
        description="Create a program to find first occurrence of a number in array"
        defaultCode={`public class FindNumber {
    public static void main(String[] args) {
        int[] numbers = {1, 3, 5, 7, 9, 11, 13, 15};
        int target = 9;
        // Add your code here to find the target number
        // Use break when number is found
    }
}`}
      />

      <ImportantNote
        title="Key Points to Remember"
        points={[
          "Break immediately exits the current loop",
          "Can be used with labels for nested loops",
          "Commonly used in search algorithms",
          "Makes code more efficient by avoiding unnecessary iterations"
        ]}
      />
    </div>
  );
};

export default BreakStatement;
