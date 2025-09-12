import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const EnhancedForLoop = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicSyntax: {
      title: '🎯 Enhanced For Loop (For-Each) Syntax',
      code: `public class EnhancedForDemo {
    public static void main(String[] args) {
        // Basic number sequence
        for (int i = 1; i <= 5; i++) {
            System.out.println("Regular for: " + i);
        }
        
        // Same using enhanced for (with range)
        for (int num : new int[]{1, 2, 3, 4, 5}) {
            System.out.println("Enhanced for: " + num);
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    limitations: {
      title: '⚠️ Limitations and Considerations',
      code: `public class EnhancedForLimitations {
    public static void main(String[] args) {
        // Regular for loop - has index access
        for (int i = 0; i < 5; i++) {
            System.out.println("Index: " + i);
        }
        
        // Enhanced for - no index access
        for (int num : new int[]{1, 2, 3, 4, 5}) {
            // Cannot know current position
            System.out.println("Value: " + num);
        }
        
        // Cannot modify counter
        // Cannot iterate in reverse
        // Cannot skip elements
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const advantageFeatures = [
    { icon: "📝", text: "Cleaner syntax" },
    { icon: "🐛", text: "Fewer bugs" },
    { icon: "🎯", text: "No index needed" }
  ];

  const useCaseFeatures = [
    { icon: "📦", text: "Array traversal" },
    { icon: "📝", text: "Collection iteration" },
    { icon: "🔍", text: "Read-only operations" }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Enhanced For Loop Basics",
      content: [
        "Enhanced for loop (for-each) simplifies array and collection iteration",
        "Automatically traverses each element without explicit indexing",
        "Perfect for when you just need to process each element once"
      ],
      code: `String[] fruits = {"apple", "banana", "orange"};
for (String fruit : fruits) {
    System.out.println(fruit);
}`
    },
    {
      icon: "⚡",
      title: "Regular vs Enhanced For Loop",
      content: [
        "Enhanced for loop is more concise but less flexible",
        "Use it when you don't need the index",
        "Great for read-only operations"
      ],
      code: `// Regular for loop
for (int i = 0; i < array.length; i++) {
    System.out.println(array[i]);
}

// Enhanced for loop
for (int item : array) {
    System.out.println(item);
}`
    }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "What is another name for enhanced for loop?",
      options: [
        "While loop",
        "For-each loop",
        "Do-while loop",
        "Infinite loop"
      ],
      correctAnswer: 1,
      explanation: "The enhanced for loop is also known as the for-each loop as it iterates through each element."
    },
    {
      id: 2,
      question: "What is the main advantage of enhanced for loop?",
      options: [
        "It's faster than regular for loop",
        "It can modify the counter variable",
        "It's more readable and simpler",
        "It can access the index"
      ],
      correctAnswer: 2,
      explanation: "Enhanced for loop provides cleaner, more readable syntax for iteration."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Enhanced For Loop in Java 🚀"
        description="The enhanced for loop (for-each) provides a simpler way to iterate over arrays and collections. It's more readable and less prone to errors, but comes with some limitations. Let's explore! 🎯"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Advantages 🎯"
          items={advantageFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Use Cases 🔍"
          items={useCaseFeatures}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicSyntax} />
        <CodeSnippet {...examples.limitations} />
      </section>

      <MistakesToAvoid
        title="Limitations and Watch-outs"
        mistakes={[
          "Cannot modify collection elements",
          "No access to index",
          "Cannot control iteration direction",
          "Cannot skip elements"
        ]}
        alternatives={[
          "Use regular for loop when you need index",
          "Use regular for loop for modifying elements",
          "Use regular for loop for custom iteration patterns",
          "Consider your needs before choosing loop type"
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
        description="Create a program that finds the sum and average of array elements using enhanced for loop"
        defaultCode={`public class ArrayStats {
    public static void main(String[] args) {
        int[] numbers = {23, 45, 12, 89, 34, 67};
        // Use enhanced for loop to calculate sum and average
    }
}`}
      />

      <ImportantNote
        title="Best Practices"
        points={[
          "Use enhanced for loop when you don't need the index",
          "Prefer it for its cleaner syntax and readability",
          "Consider performance implications for large collections",
          "Be aware of the limitations before using"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these key points about enhanced for loops:
          • Simpler syntax for iterating collections
          • Best for read-only operations
          • No index access needed
          • Cannot modify elements during iteration
          • Choose based on your specific needs
        `}
        variant="green"
      />
    </div>
  );
};

export default EnhancedForLoop;
