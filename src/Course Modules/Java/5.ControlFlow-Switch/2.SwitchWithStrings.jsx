import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const SwitchWithStrings = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🎯 Switch with Strings Example',
      code: `public class StringSwitchDemo {
    public static void main(String[] args) {
        String command = "start";
        
        switch (command) {
            case "start":
                System.out.println("Starting the application...");
                break;
            case "stop":
                System.out.println("Stopping the application...");
                break;
            case "restart":
                System.out.println("Restarting the application...");
                break;
            default:
                System.out.println("Command not recognized");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    practicalExample: {
      title: '🌟 Real World Example',
      code: `public class GameController {
    public static void main(String[] args) {
        String direction = "UP";
        
        switch (direction.toLowerCase()) {
            case "up":
                System.out.println("Moving player upward");
                break;
            case "down":
                System.out.println("Moving player downward");
                break;
            case "left":
                System.out.println("Moving player left");
                break;
            case "right":
                System.out.println("Moving player right");
                break;
            default:
                System.out.println("Invalid direction");
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
      question: "From which Java version is String supported in switch statements?",
      options: [
        "Java 5",
        "Java 6",
        "Java 7",
        "Java 8"
      ],
      correctAnswer: 2,
      explanation: "String support in switch statements was introduced in Java 7 as one of its key features."
    },
    {
      id: 2,
      question: "What happens if a String variable is null in a switch statement?",
      options: [
        "It matches the default case",
        "The code compiles but throws NullPointerException at runtime",
        "The code won't compile",
        "It automatically converts null to empty string"
      ],
      correctAnswer: 1,
      explanation: "If a String variable used in a switch statement is null, it will throw a NullPointerException at runtime."
    }
  ];

  const conceptSections = [
    {
      icon: "📝",
      title: "String Comparison in Switch",
      content: [
        "Java 7 introduced the ability to use Strings in switch statements, enabling more readable code for string-based logic.",
        "The comparison is case-sensitive and uses String.equals() method internally."
      ],
      code: `switch(str) {
    case "hello": // Uses String.equals("hello")
    case "world": // Uses String.equals("world")
}`
    },
    {
      icon: "⚡",
      title: "Null Handling",
      content: [
        "Switch statements with String require careful null handling as they can throw NullPointerException.",
        "It's recommended to check for null before the switch statement."
      ],
      code: `if (str != null) {
    switch(str) {
        // cases
    }
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Switch Statements with Strings 📝"
        description="Since Java 7, switch statements can work with String values, making them even more versatile for text-based control flow. Let's explore how to use them effectively! 🎯"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Features 🔑"
          items={[
            { icon: "📝", text: "Case-sensitive comparison" },
            { icon: "🔄", text: "String method support" },
            { icon: "⚡", text: "Compile-time constants" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Common Use Cases 🎯"
          items={[
            { icon: "🎮", text: "Command processing" },
            { icon: "🗺️", text: "Menu navigation" },
            { icon: "🔍", text: "State handling" }
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
        title="Important Considerations"
        points={[
          "Always check for null values",
          "Remember case sensitivity",
          "Use string normalization when needed",
          "Consider performance with large string comparisons"
        ]}
      />

      <ImportantNote
        title="Best Practices"
        points={[
          "Normalize strings before comparison",
          "Handle null values appropriately",
          "Use constants for repeated strings",
          "Consider using enums for fixed sets of strings"
        ]}
        variant="blue"
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
        description="Create a simple menu system using switch with String input for different operations"
        defaultCode={`public class MenuSystem {
    public static void main(String[] args) {
        String menuChoice = "help";
        
        // Write your switch statement to handle:
        // "help" - Show help menu
        // "start" - Start the program
        // "exit" - Exit the program
        // Add appropriate messages for each case
        
    }
}`}
      />
    </div>
  );
};

export default SwitchWithStrings;
