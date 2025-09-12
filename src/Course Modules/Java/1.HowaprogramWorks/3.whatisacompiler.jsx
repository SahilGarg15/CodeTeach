import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

const WhatIsCompiler = () => {
  const examples = {
    simpleProgram: {
      title: 'Simple Java Program',
      code: `public class Hello {
  public static void main(String[] args) {
    // This is a simple Java program
    System.out.println("Hello");
    System.out.println("World");
  }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    machineCode: {
      title: 'Machine Code Example',
      code: `010010110110010101101100
011011000110111101110111
0100100001100101011000010110010000100001`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const compilerWorkflow = [
    { icon: "1️⃣", text: "Reads your entire source code" },
    { icon: "2️⃣", text: "Analyzes it for errors" },
    { icon: "3️⃣", text: "Optimizes the code" },
    { icon: "4️⃣", text: "Generates machine code" }
  ];

  const compilerSuperpowers = [
    { icon: "🔍", text: "Catches errors before running" },
    { icon: "⚡", text: "Makes programs run faster" },
    { icon: "🎯", text: "Optimizes code automatically" }
  ];

  const aotFeatures = [
    { icon: "📦", text: "Compiles everything before running" },
    { icon: "🎯", text: "Creates executable files" },
    { icon: "⚡", text: "Faster program execution" }
  ];

  const jitFeatures = [
    { icon: "🔄", text: "Compiles during execution" },
    { icon: "🎯", text: "Optimizes hot code paths" },
    { icon: "☕", text: "Used by Java's JVM" }
  ];

  const conceptSections = [
    {
      icon: "🔄",
      title: "The Compilation Process",
      content: [
        "A compiler translates human-readable code into machine code",
        "It analyzes the entire program before generating output",
        "Performs optimizations to improve performance"
      ],
      code: `// Your code (source code)
System.out.println("Hello");

// Becomes machine code
01001000 01100101 01101100 01101100 01101111`
    },
    {
      icon: "🎯",
      title: "Java Compilation",
      content: [
        "Java uses a two-step compilation process",
        "First compiles to bytecode (.class files)",
        "JVM then runs the bytecode"
      ],
      code: `// Step 1: javac Hello.java → Hello.class
// Step 2: java Hello`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="What is a Compiler? 🔄"
        description="Think of a compiler as a master translator that turns your human-friendly code into a language your computer understands. It's like converting a recipe from English to Computer-ese! 🌐"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="How a Compiler Works 🎯"
          items={compilerWorkflow}
          variant="blue"
        />
        <KeyFeatures
          title="Compiler Superpowers 💪"
          items={compilerSuperpowers}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">The Compilation Journey 🚀</h2>
        <CodeSnippet {...examples.simpleProgram} />
        <CodeSnippet {...examples.machineCode} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Ahead of Time (AOT) ⚡"
          items={aotFeatures}
          variant="green"
        />
        <KeyFeatures
          title="Just in Time (JIT) 🚀"
          items={jitFeatures}
          variant="yellow"
        />
      </div>

      <ImportantNote
        title="Fun Facts! 🌟"
        points={[
          "The first compiler was developed by Grace Hopper in 1952!",
          "She proved that code could be written in a human-friendly way",
          "Modern compilers can perform over 200 different optimizations",
          "Java uses both compilation and interpretation"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Key Points 📝"
        description={`
          Remember these essential points about compilers:
          • Translates source code to machine code
          • Catches errors before program runs
          • Optimizes code for better performance
          • Java uses a special two-step process
          • Different types: AOT and JIT compilation
        `}
        variant="green"
      />
    </div>
  );
};

export default WhatIsCompiler;
