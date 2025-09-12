import React from 'react';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

const ProgramFlowchart = () => (
  <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 600 300">
    {/* Boxes with improved visibility */}
    <rect x="240" y="20" width="120" height="40" rx="5" fill="#2563eb" opacity="0.3" stroke="#2563eb"/>
    <rect x="240" y="100" width="120" height="40" rx="5" fill="#2563eb" opacity="0.2" stroke="#2563eb"/>
    <path d="M300 180 L260 220 L340 220 Z" fill="#9333ea" opacity="0.2" stroke="#9333ea"/>
    <rect x="140" y="240" width="120" height="40" rx="5" fill="#2563eb" opacity="0.2" stroke="#2563eb"/>
    <rect x="340" y="240" width="120" height="40" rx="5" fill="#2563eb" opacity="0.2" stroke="#2563eb"/>

    {/* Arrows */}
    <path d="M300 60 L300 100" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M300 140 L300 180" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M300 220 L200 240" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M300 220 L400 240" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arrowhead)"/>

    {/* Arrow Marker Definition */}
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5"/>
      </marker>
    </defs>

    {/* Text */}
    <text x="300" y="45" textAnchor="middle" fill="#fff" className="text-sm font-semibold">Input</text>
    <text x="300" y="125" textAnchor="middle" fill="#fff">Process</text>
    <text x="300" y="205" textAnchor="middle" fill="#fff">Decision</text>
    <text x="200" y="265" textAnchor="middle" fill="#fff">Action 1</text>
    <text x="400" y="265" textAnchor="middle" fill="#fff">Action 2</text>
  </svg>
);

const WhatIsAProgram = () => {
  const programSteps = [
    { icon: "📝", text: "Move your right foot forward" },
    { icon: "🔄", text: "Spin around once" },
    { icon: "👏", text: "Clap your hands" }
  ];

  const dataPoints = [
    { icon: "🔢", text: "Numbers for calculations" },
    { icon: "📝", text: "Text for messages" },
    { icon: "🖼️", text: "Images and other media" },
    { icon: "📦", text: "Any information needed" }
  ];

  const logicPoints = [
    { icon: "🤔", text: "Makes decisions based on conditions" },
    { icon: "🔄", text: "Handles different situations" },
    { icon: "⚡", text: "Controls program flow" }
  ];

  const examplePoints = [
    { icon: "📸", text: "Instagram filters (transforming photos)" },
    { icon: "🧮", text: "Calculator app (processing numbers)" },
    { icon: "🌤️", text: "Weather app (showing forecasts)" },
    { icon: "🎮", text: "Games (responding to controls)" }
  ];

  const conceptSections = [
    {
      icon: "📝",
      title: "Instructions (The Recipe)",
      content: [
        "Programs work like following a dance tutorial",
        "They follow precise instructions one at a time",
        "Each step is clear and specific"
      ],
      code: null
    },
    {
      icon: "📦",
      title: "Data (The Ingredients)",
      content: [
        "Data is like ingredients in your recipe",
        "Programs work with numbers, text, images",
        "Different types of data for different tasks"
      ],
      code: null
    },
    {
      icon: "🧠",
      title: "Logic (The Decision-Making)",
      content: [
        "Programs make decisions based on conditions",
        "Like cooking: 'if water is boiling, add pasta'",
        "Different actions for different situations"
      ],
      code: null
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="What is a Program? 🚀"
        description="Imagine you're teaching a friendly robot to make your favorite sandwich! 🤖🥪 That's exactly what programming is - giving clear, step-by-step instructions to a computer. Every click, swipe, or tap on your phone or computer is actually running a program behind the scenes!"
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Let's Visualize How a Program Works! 📊
        </h2>
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <ProgramFlowchart />
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">The Three Superpowers of Programming 💫</h2>
      
      <ConceptExplanation sections={conceptSections} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Program Steps 📝"
          items={programSteps}
          variant="blue"
        />
        <KeyFeatures
          title="Program Data 📦"
          items={dataPoints}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Program Logic 🧠"
          items={logicPoints}
          variant="green"
        />
        <KeyFeatures
          title="Real Examples 🌟"
          items={examplePoints}
          variant="yellow"
        />
      </div>

      <ImportantNote
        title="Calculator Example"
        points={[
          "Instructions: Add two numbers",
          "Data: The numbers 5 and 3",
          "Logic: If both are numbers, add them",
          "Result: 5 + 3 = 8"
        ]}
        variant="blue"
      />

      <Summary 
        title="Key Points 📝"
        description={`
          Remember these key points about programs:
          • Programs are like recipes with clear instructions
          • They work with different types of data
          • They make decisions using logic
          • They're behind everything your computer does
          • They can be simple or complex
        `}
        variant="green"
      />
    </div>
  );
};

export default WhatIsAProgram;
