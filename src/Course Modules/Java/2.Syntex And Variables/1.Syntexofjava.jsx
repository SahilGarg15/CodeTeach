import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';

const SyntexofJava = () => {
  const examples = {
    basicStructure: {
      title: '🏗️ Java Program Structure',
      code: `// This is a comment
public class MyProgram {
    public static void main(String[] args) {
        // Your code goes here
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    helloWorld: {
      title: '👋 Hello World Example',
      code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    emptyTemplate: {
      code: ''  // Changed from ' ' to '' to prevent unwanted space
    }
  };

  const essentialComponents = [
    { icon: "📦", text: "Class Declaration" },
    { icon: "🎯", text: "Main Method" },
    { icon: "🔤", text: "Statements & Expressions" }
  ];

  const syntaxRules = [
    { icon: "✨", text: "Each statement ends with a semicolon" },
    { icon: "🎨", text: "Code blocks are enclosed in curly braces" },
    { icon: "📝", text: "Case-sensitive language" }
  ];

  const conceptSections = [
    {
      icon: "📦",
      title: "Basic Program Structure",
      content: [
        "Every Java program must have a class",
        "The main method is where your program starts executing",
        "Code blocks are enclosed in curly braces { }"
      ],
      code: `public class MyProgram {
    public static void main(String[] args) {
        // Your code goes here
    }
}`
    },
    {
      icon: "🖨️",
      title: "Understanding System.out.println",
      content: [
        "System - The built-in Java class that contains useful tools",
        "out - The output stream to display information",
        "println - The method that prints text and adds a new line"
      ],
      code: `System.out.println("Hello, World!");
// Displays: Hello, World!`
    }
  ];

  const fileNamingRules = [
    { icon: "📄", text: "File name must match class name" },
    { icon: "🔍", text: "Case sensitivity matters" },
    { icon: "📝", text: "Must end with .java extension" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Understanding Java Syntax 📝"
        description="Java syntax is like the grammar rules of the language. Just as English has rules for forming sentences, Java has rules for writing programs. Let's explore these rules! 🚀"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Essential Components 📌"
          items={essentialComponents}
          variant="blue"
        />
        <KeyFeatures
          title="Syntax Rules ⚡"
          items={syntaxRules}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Your First Program 🎉</h2>
        <CodeSnippet {...examples.helloWorld} />
      </section>

      <ImportantNote
        title="File Naming Rules ⚠️"
        points={[
          "The Java file name must exactly match the public class name",
          "If your class is HelloWorld, your file must be HelloWorld.java",
          "Java is case-sensitive, so the names must match exactly",
          "Each public class must be in its own file"
        ]}
        variant="yellow"
      />

      <KeyFeatures
        title="File Naming Convention 📄"
        items={fileNamingRules}
        variant="green"
      />

      <MistakesToAvoid
        title="Common Syntax Mistakes"
        mistakes={[
          "Forgetting semicolons at the end of statements",
          "Mismatched curly braces",
          "Wrong file name (doesn't match class name)",
          "Missing main method",
          "Incorrect capitalization"
        ]}
        alternatives={[
          "Use an IDE to help with syntax",
          "Keep proper indentation",
          "Double-check class and file names",
          "Copy the basic structure until familiar"
        ]}
      />

      <HandsOn
        title="Try It Yourself! 💻"
        description="Write your first Java program completely from scratch! Try to recreate the Hello World program by typing everything yourself."
        defaultCode={`// File: Main.java
// Write your Hello World program here`}
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these essential points about Java syntax:
          • Every program needs a class and main method
          • Statements end with semicolons
          • Code blocks use curly braces
          • File name must match class name
          • Java is case-sensitive
        `}
        variant="green"
      />
    </div>
  );
};

export default SyntexofJava;
