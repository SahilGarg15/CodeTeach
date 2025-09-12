import React from 'react';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';

// Keep existing TimelineEvent component
const TimelineEvent = ({ year, title, description }) => (
  <div className="relative pl-8 py-4 transition-all duration-300 hover:scale-[1.02]">
    <div className="absolute left-0 top-0 mt-7 -ml-1.5 h-3 w-3 rounded-full border-2 border-blue-400 bg-gray-900"></div>
    <div className="absolute left-0 top-0 mt-8 h-full w-px bg-gradient-to-b from-blue-500/50 to-transparent"></div>
    <div className="text-blue-400 font-mono text-sm">{year}</div>
    <h3 className="text-lg font-medium text-gray-200 mt-1">{title}</h3>
    <p className="text-gray-300 mt-1">{description}</p>
  </div>
);

const History = () => {
  const javaFeatures = [
    { icon: "✨", text: "Simple and Easy to Learn" },
    { icon: "🔒", text: "Secure and Robust" },
    { icon: "🌐", text: "Platform Independent" },
    { icon: "🎯", text: "Object-Oriented" }
  ];

  const timelineEvents = [
    {
      year: "1991",
      title: "The Green Project Begins",
      description: "James Gosling and team start working on a new programming language for digital devices."
    },
    {
      year: "1995",
      title: "First Public Release",
      description: "Java 1.0 is released with the promise: Write Once, Run Anywhere!"
    },
    {
      year: "1996",
      title: "JavaScript Partnership",
      description: "Netscape and Sun form an alliance, bringing Java to web browsers."
    },
    {
      year: "2010",
      title: "Oracle Acquisition",
      description: "Oracle Corporation acquires Sun Microsystems and takes over Java development."
    },
    {
      year: "Present",
      title: "Java Today",
      description: "Powers Android apps, enterprise software, and remains one of the most popular programming languages."
    }
  ];

  const famousApps = [
    { icon: "🎮", text: "Minecraft" },
    { icon: "🔧", text: "Eclipse IDE" },
    { icon: "📱", text: "Android Apps" },
    { icon: "🚀", text: "NASA Projects" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Summary 
        title="The Journey of Java ☕"
        description="Ever wondered how one of the world's most popular programming languages came to be? Let's travel back in time to 1991, when a small team at Sun Microsystems embarked on a journey that would revolutionize the world of programming! 🚀"
      />

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          The Birth of a Programming Legend 🌟
        </h2>
        
        <KeyFeatures
          title="The Green Team"
          items={[
            { icon: "👨‍💻", text: "Led by James Gosling" },
            { icon: "🌳", text: "Originally called 'Oak'" },
            { icon: "☕", text: "Renamed to Java" }
          ]}
          variant="green"
        />
      </div>

      {/* Keep Timeline Section as is since it's a custom visualization */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Java Through the Years 📅</h2>
        <div className="border-l border-blue-500/20 ml-4">
          {timelineEvents.map((event, index) => (
            <TimelineEvent key={index} {...event} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Why 'Java'? ☕"
          items={[
            { icon: "☕", text: "Named after Java coffee" },
            { icon: "🎯", text: "Creators' favorite drink" },
            { icon: "🏆", text: "Simple, memorable name" }
          ]}
          variant="purple"
        />
        <KeyFeatures
          title="Famous Java Apps 🎮"
          items={famousApps}
          variant="blue"
        />
      </div>

      <ImportantNote
        title="Why Java Succeeded 🎯"
        points={[
          "Simple and Easy to Learn",
          "Secure and Robust",
          "Platform Independent",
          "Object-Oriented Design"
        ]}
        variant="yellow"
      />
    </div>
  );
};

export default History;
