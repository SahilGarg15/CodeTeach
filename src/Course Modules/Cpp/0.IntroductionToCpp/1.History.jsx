import React from 'react';

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
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        The Evolution of C++ 🚀
      </h1>

      {/* Hero Section */}
      <div className="mt-6 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <p className="text-gray-300 text-lg leading-relaxed">
          Embark on a journey through time to discover how C++ emerged from C and revolutionized 
          the world of programming. From its humble beginnings as "C with Classes" to becoming 
          one of the most powerful and versatile programming languages! 💻
        </p>
      </div>

      {/* Birth of C++ Section */}
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          The Birth of a Programming Powerhouse 💪
        </h2>
        
        <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-700/10 rounded-xl border border-green-500/20 
          transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <span className="text-3xl">👨‍🔬</span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-green-400">Bjarne Stroustrup's Vision</h3>
              <p className="mt-2 text-gray-300">
                In 1979, Bjarne Stroustrup began developing C++ at Bell Labs as an enhancement to 
                the C language. His goal was to add object-oriented programming features without 
                sacrificing C's performance and flexibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">C++ Through the Years 📅</h2>
        <div className="border-l border-blue-500/20 ml-4">
          <TimelineEvent 
            year="1979"
            title="C with Classes"
            description="Bjarne Stroustrup starts developing what would later become C++."
          />
          <TimelineEvent 
            year="1983"
            title="The Name 'C++'"
            description="The language is renamed to C++, with '++' being the increment operator in C."
          />
          <TimelineEvent 
            year="1985"
            title="First Commercial Release"
            description="First commercial release of C++ with Cfront 1.0 compiler."
          />
          <TimelineEvent 
            year="1998"
            title="First ISO Standard"
            description="C++ standardized by ISO committee (C++98)."
          />
          <TimelineEvent 
            year="2011"
            title="Modern C++"
            description="C++11 released, bringing major modernization to the language."
          />
        </div>
      </div>

      {/* Fun Facts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-700/10 rounded-xl border border-purple-500/20 
          transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
          <h3 className="text-xl font-medium text-purple-400 flex items-center gap-2">
            <span>🤔</span> Why "C++"?
          </h3>
          <p className="mt-2 text-gray-300">
            The name C++ is a play on the ++ operator in C, suggesting that C++ is an 
            incremented (or improved) version of C!
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-xl border border-blue-500/20 
          transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10">
          <h3 className="text-xl font-medium text-blue-400 flex items-center gap-2">
            <span>🎮</span> Famous C++ Applications
          </h3>
          <p className="mt-2 text-gray-300">
            Many major systems use C++: Windows, macOS, most game engines (Unreal Engine), 
            browsers (Chrome, Firefox), and even space exploration software!
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
        <h3 className="text-xl font-medium text-yellow-400 mb-3">🎯 Why C++ Succeeded</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-green-400">⚡</span>
            <span>High Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">🔧</span>
            <span>Low-Level Memory Control</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">🎯</span>
            <span>Object-Oriented Features</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">📚</span>
            <span>Rich Standard Library</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default History;
