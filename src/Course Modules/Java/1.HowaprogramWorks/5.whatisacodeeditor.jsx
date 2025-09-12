import React from 'react';
import CodeEditor from '../../../Frontend/Components/Code Components/CodeEditor';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

const WhatIsCodeEditor = () => {
  const smartFeatures = [
    { icon: "🎨", text: "Syntax highlighting makes code easier to read" },
    { icon: "💡", text: "Auto-completion suggests code as you type" },
    { icon: "🐞", text: "Error detection finds mistakes instantly" }
  ];

  const helpfulTools = [
    { icon: "📏", text: "Line numbers help track code location" },
    { icon: "🔍", text: "Search and replace across files" },
    { icon: "⚡", text: "Keyboard shortcuts speed up coding" }
  ];

  const editorTypes = [
    { icon: "💼", text: "IntelliJ IDEA - Professional IDE" },
    { icon: "🌓", text: "Eclipse - Free and open-source" },
    { icon: "⚡", text: "VS Code - Lightweight and versatile" }
  ];

  const shortcuts = [
    { icon: "⌨️", text: "Format Code: Shift + Alt + F" },
    { icon: "🔧", text: "Quick Fix: Ctrl + ." },
    { icon: "🔍", text: "Find in File: Ctrl + F" }
  ];

  const conceptSections = [
    {
      icon: "🖥️",
      title: "What is a Code Editor?",
      content: [
        "A code editor is like a word processor designed specifically for writing code",
        "It provides special features to make programming easier and more efficient",
        "Modern editors include advanced tools for debugging and code organization"
      ],
      code: `// Example of syntax highlighting
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello!");
    }
}`
    },
    {
      icon: "🎯",
      title: "Why Use VS Code?",
      content: [
        "VS Code is lightweight yet powerful",
        "Excellent Java support through extensions",
        "Great for beginners and professionals alike",
        "Free and open-source"
      ],
      code: null
    }
  ];

  const simpleExample = `public class HelloWorld {
    public static void main(String[] args) {
        // Try changing this message!
        System.out.println("Hello, Programmer!");
    }
}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="What is a Code Editor? 🖥️"
        description="Think of a code editor as your programming workshop - it's like Microsoft Word, but with superpowers specifically designed for writing code! Let's explore what makes it special. ✨"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Smart Features 🧠"
          items={smartFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Helpful Tools 🛠️"
          items={helpfulTools}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <HandsOn
        title="Try It Yourself! 🎯"
        description="Here's a live code editor - try editing the message and run the code:"
        defaultCode={simpleExample}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Popular Java Editors 🌟"
          items={editorTypes}
          variant="yellow"
        />
        <KeyFeatures
          title="VS Code Shortcuts ⌨️"
          items={shortcuts}
          variant="green"
        />
      </div>

      <ImportantNote
        title="VS Code Extensions"
        points={[
          "Extension Pack for Java",
          "Debugger for Java",
          "Test Runner for Java",
          "Project Manager for Java"
        ]}
        variant="blue"
      />

      <ImportantNote
        title="Productivity Features"
        points={[
          "IntelliSense code suggestions",
          "Built-in Git integration",
          "Live code sharing",
          "Integrated terminal"
        ]}
        variant="green"
      />

      <Summary 
        title="Key Points 📝"
        description={`
          Remember these essential points about code editors:
          • They make coding easier and more efficient
          • VS Code is our recommended editor for this course
          • Install necessary extensions for Java development
          • Learn keyboard shortcuts to boost productivity
          • Use features like auto-completion and error detection
        `}
        variant="green"
      />
    </div>
  );
};

export default WhatIsCodeEditor;
