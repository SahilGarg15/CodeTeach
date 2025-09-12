import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const SimpleIfStatement = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    basicStructure: {
      title: '🏗️ If Statement Structure',
      code: `public class IfStructure {
    public static void main(String[] args) {
        // Basic if statement structure
        if (condition) {
            // Code to execute if condition is true
            // This block is skipped if condition is false
        }
        
        // Program continues here
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    simpleExample: {
      title: '👶 Simple Example',
      code: `public class AgeCheck {
    public static void main(String[] args) {
        int age = 18;
        
        if (age >= 18) {
            System.out.println("You are an adult!");
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    booleanExample: {
      title: '✅ Boolean Conditions',
      code: `public class LightSwitch {
    public static void main(String[] args) {
        boolean isLightOn = true;
        
        if (isLightOn) {
            System.out.println("The room is bright!");
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
      question: "What will happen if the condition in an if statement is false?",
      options: [
        "The code inside the if block will run",
        "The program will crash",
        "The code inside the if block will be skipped",
        "The program will show an error"
      ],
      correctAnswer: 2,
      explanation: "When an if statement's condition is false, the code block inside the if statement is simply skipped, and the program continues with the next instruction after the if block."
    },
    {
      id: 2,
      question: "Which of the following is the correct syntax for an if statement in Java?",
      options: [
        "if condition { }",
        "if (condition) { }",
        "if [condition] { }",
        "if condition: { }"
      ],
      correctAnswer: 1,
      explanation: "The correct syntax requires parentheses () around the condition. The proper format is: if (condition) { }"
    }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "Basic Structure",
      content: [
        "The if statement is the most basic form of control flow in Java.",
        "It executes a block of code only when a specified condition evaluates to true."
      ],
      code: `if (condition) {
    // This code only runs
    // when condition is true
}`
    },
    {
      icon: "⚡",
      title: "Boolean Conditions",
      content: [
        "The condition must result in a boolean value (true/false).",
        "Common comparisons include >, <, >=, <=, ==, and !="
      ],
      code: `boolean isRaining = true;
if (isRaining) {
    // Runs when isRaining is true
}

if (temperature > 25) {
    // Runs when temperature is greater than 25
}`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="If Statements in Java 🔍"
        description="If statements are like decision points in your code. They help your program make choices based on conditions, just like how we make decisions in real life! 🤔"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Key Components 📌"
          items={[
            { icon: "🎯", text: "Condition (must be boolean)" },
            { icon: "📦", text: "Code Block (in curly braces)" },
            { icon: "➡️", text: "Flow Control" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="Important Rules ⚡"
          items={[
            { icon: "✨", text: "Condition must be in parentheses" },
            { icon: "🎨", text: "No semicolon after condition" },
            { icon: "📝", text: "Curly braces for multiple statements" }
          ]}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Basic Structure 🏗️</h2>
        <CodeSnippet {...examples.basicStructure} />
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-gray-300">
            The condition in an if statement must result in a <code className="text-blue-400">boolean</code> value 
            (true or false). The code block only runs when the condition is true!
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Simple Examples 👶</h2>
        <CodeSnippet {...examples.simpleExample} />
        <CodeSnippet {...examples.booleanExample} />
      </section>

      <MistakesToAvoid
        title="Common Mistakes"
        mistakes={[
          "Using = instead of == for comparison",
          "Putting a semicolon after the if condition",
          "Forgetting parentheses around the condition"
        ]}
        alternatives={[
          "Use meaningful variable names for boolean conditions",
          "Extract complex conditions into boolean methods",
          "Use proper indentation for better readability",
          "Consider using constants for magic numbers"
        ]}
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">Quick Check! 📝</h2>
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
        title="Try It Yourself! 💻"
        description="Write a program that checks if a temperature is above 25°C and prints 'It's warm today!' if it is."
        defaultCode={`public class WeatherCheck {
    public static void main(String[] args) {
        double temperature = 28.5;
        
        // Write your if statement here
        
    }
}`}
      />
    </div>
  );
};

export default SimpleIfStatement;
