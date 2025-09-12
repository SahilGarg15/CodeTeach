import React from 'react';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

// Helper component for installation steps
const InstallStep = ({ number, title, children }) => (
  <div className="mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
    <h3 className="flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-mono">
        {number}
      </span>
      <span className="text-xl text-blue-400">{title}</span>
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Helper component for screenshot placeholders
const Screenshot = ({ alt, caption }) => (
  <div className="my-4 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
    <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Screenshot: {alt}</span>
    </div>
    {caption && (
      <p className="mt-2 text-sm text-gray-400 text-center">{caption}</p>
    )}
  </div>
);

const InstallationOfJavaOnWindows = () => {
  const jdkFeatures = [
    { icon: "⚙️", text: "Java Development Kit (JDK)" },
    { icon: "🔨", text: "Development Tools" },
    { icon: "📚", text: "Core Libraries" }
  ];

  const vsCodeFeatures = [
    { icon: "📝", text: "VS Code Editor" },
    { icon: "🧩", text: "Java Extensions" },
    { icon: "🚀", text: "Code Runner" }
  ];

  const jdkSteps = [
    {
      icon: "📥",
      title: "Download JDK",
      content: [
        "Visit the official Oracle website",
        "Download JDK for Windows",
        "Choose the latest LTS version"
      ],
      code: null
    },
    {
      icon: "⚙️",
      title: "Installation",
      content: [
        "Run the installer",
        "Accept license agreement",
        "Choose installation directory",
        "Wait for installation to complete"
      ],
      code: null
    },
    {
      icon: "🔧",
      title: "Environment Setup",
      content: [
        "Set JAVA_HOME variable",
        "Update PATH variable",
        "Verify installation with 'java --version'"
      ],
      code: `// In Command Prompt:
java --version
javac --version`
    }
  ];

  const vsCodeSteps = [
    {
      icon: "💻",
      title: "VS Code Setup",
      content: [
        "Download VS Code from official website",
        "Run the installer with recommended settings",
        "Install Java Extension Pack"
      ],
      code: null
    }
  ];

  const essentialExtensions = [
    { icon: "📦", text: "Extension Pack for Java" },
    { icon: "🐛", text: "Debugger for Java" },
    { icon: "🧪", text: "Test Runner for Java" },
    { icon: "📁", text: "Project Manager for Java" }
  ];

  const shortcuts = [
    { icon: "⌨️", text: "Format Code: Shift + Alt + F" },
    { icon: "🔧", text: "Quick Fix: Ctrl + ." },
    { icon: "🔍", text: "Find in File: Ctrl + F" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Setting Up Your Java Development Environment 🛠️"
        description="Let's get your computer ready for Java programming! We'll install the Java Development Kit (JDK) and Visual Studio Code - everything you need to start coding in Java! 🚀"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Required Tools"
          items={jdkFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Code Editor"
          items={vsCodeFeatures}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={jdkSteps} />

      <ConceptExplanation sections={vsCodeSteps} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Essential Extensions 🧩"
          items={essentialExtensions}
          variant="green"
        />
        <KeyFeatures
          title="Useful Shortcuts ⌨️"
          items={shortcuts}
          variant="yellow"
        />
      </div>

      <ImportantNote
        title="VS Code Pro Tips"
        points={[
          "Install all recommended extensions",
          "Enable auto save",
          "Use integrated terminal",
          "Learn keyboard shortcuts"
        ]}
        variant="blue"
      />

      <ImportantNote
        title="Troubleshooting Tips"
        points={[
          "Double-check environment variables",
          "Restart VS Code after installing extensions",
          "Make sure JDK is properly installed",
          "Verify Java version in terminal"
        ]}
        variant="yellow"
      />

      <ImportantNote
        title="Alternative Learning Options"
        points={[
          "Our course includes a built-in code editor",
          "You can start learning without local setup",
          "Perfect for beginners - no configuration needed",
          "Set up local environment later when comfortable"
        ]}
        variant="green"
      />

      <Summary 
        title="Ready to Code! 🚀"
        description={`
          You've successfully set up your Java development environment:
          • JDK is installed and configured
          • VS Code is ready with extensions
          • Environment variables are set
          • You can now write and run Java programs!
        `}
        variant="green"
      />
    </div>
  );
};

export default InstallationOfJavaOnWindows;
