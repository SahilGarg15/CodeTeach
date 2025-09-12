import React from 'react';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

// Keep FeatureCard for specific styling if needed
const FeatureCard = ({ emoji, title, description }) => (
  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/50">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <h3 className="text-yellow-400 font-medium mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const WhyJava = () => {
  const javaFeatures = [
    { icon: "🎯", text: "Easy to Learn" },
    { icon: "🌍", text: "Works Everywhere" },
    { icon: "🛡️", text: "Safe and Secure" },
    { icon: "🤝", text: "Huge Community" }
  ];

  const mobileApps = [
    { icon: "📱", text: "Instagram" },
    { icon: "🎵", text: "Spotify" },
    { icon: "🎬", text: "Netflix" },
    { icon: "📱", text: "Most Android apps" }
  ];

  const games = [
    { icon: "⚒️", text: "Minecraft" },
    { icon: "🎮", text: "Online multiplayer games" },
    { icon: "🎓", text: "Educational games" },
    { icon: "📱", text: "Mobile games" }
  ];

  const conceptSections = [
    {
      icon: "🎓",
      title: "Learning Curve",
      content: [
        "Java is like learning to drive an automatic car:",
        "• Starts with basic concepts",
        "• Clear rules to follow",
        "• Lots of helpful error messages",
        "• Great documentation and tutorials"
      ],
      code: null
    },
    {
      icon: "💼",
      title: "Career Opportunities",
      content: [
        "Learning Java can lead to many exciting careers:",
        "• Mobile App Developer",
        "• Software Engineer",
        "• Game Developer",
        "• Web Developer"
      ],
      code: null
    }
  ];

  const readyToStart = [
    { icon: "✓", text: "Start with simple 'Hello, World!' programs" },
    { icon: "✓", text: "Build up to more complex applications" },
    { icon: "✓", text: "Practice with fun projects" },
    { icon: "✓", text: "Join the Java community" }
  ];

  return (
    <div className="space-y-8">
      <Summary 
        title="Why Should You Learn Java? 🤔"
        description="Hey there! 👋 Wondering why you should pick Java as your first programming language? Let's break it down in the simplest way possible!"
      />

      <KeyFeatures
        title="The Amazing Things About Java 🌟"
        items={javaFeatures}
        variant="blue"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Mobile Apps 📱"
          items={mobileApps}
          variant="blue"
        />
        <KeyFeatures
          title="Games 🎮"
          items={games}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <KeyFeatures
        title="Ready to Start? 🎉"
        items={readyToStart}
        variant="green"
      />

      <ImportantNote
        title="Why Java is Perfect for Beginners"
        points={[
          "Simple English-like syntax",
          "Strong safety features prevent common mistakes",
          "Huge community for support",
          "Plenty of learning resources",
          "Great job opportunities"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Your Journey Starts Here! 🚀"
        description={`
          Java offers:
          • Easy learning curve
          • Massive community support
          • Excellent job prospects
          • Cross-platform compatibility
          • Strong security features
          Let's start your coding adventure! 💪
        `}
        variant="green"
      />
    </div>
  );
};

export default WhyJava;
