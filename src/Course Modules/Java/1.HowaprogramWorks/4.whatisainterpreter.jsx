import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

const WhatIsInterpreter = () => {
  const interpreterSteps = [
    {
      code: 'print("Hello!")',
      execution: 'Reading line 1, translating, executing...',
      output: 'Hello!'
    },
    {
      code: 'x = 5 + 3',
      execution: 'Reading line 2, calculating...',
      output: 'Variable x = 8'
    },
    {
      code: 'if x > 5:\n    print("Big number!")',
      execution: 'Checking condition...',
      output: 'Big number!'
    }
  ];

  const interpreterWorkflow = [
    { icon: "1️⃣", text: "Reads one line of code" },
    { icon: "2️⃣", text: "Translates it immediately" },
    { icon: "3️⃣", text: "Executes that line" },
    { icon: "4️⃣", text: "Moves to next line" }
  ];

  const interpreterAdvantages = [
    { icon: "🔄", text: "Easy to test and debug" },
    { icon: "⚡", text: "Instant feedback" },
    { icon: "🌐", text: "Platform independent" }
  ];

  const conceptSections = [
    {
      icon: "🎭",
      title: "What is an Interpreter?",
      content: [
        "An interpreter translates and executes code line by line",
        "Think of it as a real-time translator for your code",
        "It reads, understands, and executes instructions immediately"
      ],
      code: `# Python example
print("Hello!")  # Interpreter reads and executes this line
x = 5 + 3       # Then moves to this line
print(x)        # Finally executes this line`
    },
    {
      icon: "⚡",
      title: "How It Works",
      content: [
        "Each line is processed individually",
        "No need to compile the entire program",
        "Errors are found as each line is executed"
      ],
      code: null
    }
  ];

  const examples = {
    pythonExample: {
      title: 'Python Example',
      code: `# Python (Interpreted)
name = input("What's your name?")
print("Hello, " + name)
age = 25
if age > 18:
    print("You're an adult!")`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="What is an Interpreter? 🔍"
        description="Imagine having a personal translator who translates a foreign language for you in real-time as someone speaks! That's exactly what an interpreter does with your code - it reads, translates, and executes your instructions line by line, right away! 🎭"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="How an Interpreter Works 🎯"
          items={interpreterWorkflow}
          variant="blue"
        />
        <KeyFeatures
          title="Interpreter Advantages 💪"
          items={interpreterAdvantages}
          variant="green"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <div className="space-y-4">
        {interpreterSteps.map((step, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <CodeSnippet code={step.code} language="python" />
            <p className="text-yellow-400 text-sm mt-2">{step.execution}</p>
            <p className="text-green-400 text-sm mt-1">➜ {step.output}</p>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Real World Example 🌟</h2>
        <CodeSnippet {...examples.pythonExample} language="python" />
      </section>

      <ImportantNote
        title="Fun Facts! 🎈"
        points={[
          "JavaScript, Python, and Ruby are popular interpreted languages",
          "Some languages use both compilation and interpretation",
          "Java compiles to bytecode first, then interprets it",
          "Interpreted languages are often easier to learn and test"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Key Points 📝"
        description={`
          Remember these key points about interpreters:
          • They translate and execute code line by line
          • Provide immediate feedback and easier debugging
          • Great for learning and rapid development
          • Used in many popular programming languages
          • Some languages combine interpretation and compilation
        `}
        variant="green"
      />
    </div>
  );
};

export default WhatIsInterpreter;
