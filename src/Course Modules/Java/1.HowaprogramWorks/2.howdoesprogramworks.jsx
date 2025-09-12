import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

const HowDoesAProgramWork = () => {
  const examples = {
    helloWorld: {
      title: 'Hello World Example',
      code: `public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`
    },
    calculator: {
      title: 'Simple Calculator Example',
      code: `public class Main {
  public static void main(String[] args) {
    int x = 5 + 3;
    System.out.println(x);
  }
}`
    },
    simplePrint: {
      title: 'Simple Print Statement',
      code: `System.out.println("Hello!");`
    }
  };

  const jvmFeatures = [
    { icon: "🌍", text: "Runs Java programs on any device" },
    { icon: "🧹", text: "Manages program memory automatically" },
    { icon: "🔒", text: "Ensures program security" },
    { icon: "⚡", text: "Optimizes code while running" }
  ];

  const jvmSpecials = [
    { icon: "✨", text: "Write Once, Run Anywhere" },
    { icon: "🗑️", text: "Automatic Memory Cleaning" },
    { icon: "🚀", text: "Makes Programs Faster" },
    { icon: "🛡️", text: "Keeps Programs Safe" }
  ];

  const coolFeatures = [
    { icon: "🚀", text: "Java programs can run on any device" },
    { icon: "🧠", text: "JVM optimizes code while running" },
    { icon: "🔄", text: "Automatic memory management" }
  ];

  const conceptSections = [
    {
      icon: "📝",
      title: "Source Code",
      content: [
        "Programs start as human-readable code",
        "Written in Java programming language",
        "Easy to understand and modify"
      ],
      code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    },
    {
      icon: "🔄",
      title: "Compilation Process",
      content: [
        "Java uses a two-step compilation process",
        "Source code is first converted to bytecode",
        "JVM then converts bytecode to machine code"
      ],
      code: `// Step 1: .java → .class (bytecode)
// Step 2: .class → machine code`
    },
    {
      icon: "⚡",
      title: "Program Execution",
      content: [
        "JVM loads the program into memory",
        "Verifies code for safety",
        "Executes instructions one by one",
        "Manages memory automatically"
      ],
      code: `// Program execution steps:
1. Loading
2. Verification
3. Execution
4. Memory Management`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="How Does a Program Work? 🔄"
        description="Imagine you have a LEGO building instruction manual, but it's written in a language your friend doesn't understand. To build the LEGO set together, you need to translate those instructions! That's exactly what happens when your program runs - it's a journey from human-readable code to computer instructions. Let's explore this fascinating process! 🚀"
      />

      <ConceptExplanation sections={conceptSections} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Main Jobs of JVM 🎯"
          items={jvmFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Why JVM is Special 🌟"
          items={jvmSpecials}
          variant="purple"
        />
      </div>

      <ImportantNote
        title="Fun Fact!"
        points={[
          "The same Java program can run on your phone, computer, or even a smart TV - all thanks to JVM!",
          "It's like having a universal adapter for your code. 🔌"
        ]}
        variant="yellow"
      />

      <KeyFeatures
        title="Cool Things to Know! 🌟"
        items={coolFeatures}
        variant="green"
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Try It Yourself! 🎯</h2>
        <CodeSnippet {...examples.simplePrint} language="java" showLineNumbers={false} />
        <ImportantNote
          title="Your Computer:"
          points={[
            "1. Reads your source code",
            "2. Compiles it to bytecode",
            "3. JVM translates it to machine code",
            "4. Executes the instructions",
            "5. Shows output on your screen"
          ]}
          variant="blue"
        />
      </section>

      <Summary 
        title="Key Points 📝"
        description={`
          Remember these essential points:
          • Java code goes through a two-step compilation process
          • JVM makes Java programs run anywhere
          • Memory is managed automatically
          • Code is optimized while running
          • Security is built into the system
        `}
        variant="green"
      />
    </div>
  );
};

export default HowDoesAProgramWork;
