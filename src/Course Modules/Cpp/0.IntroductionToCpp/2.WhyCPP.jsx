import React from 'react';

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

const WhyCPP = () => {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Why Should You Learn C++? 🤔
        </h1>
        
        <div className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20">
          <p className="text-lg text-gray-200 leading-relaxed">
            Hey there! 👋 Wondering why C++ might be the perfect programming language for you? 
            Let's explore the power and versatility of C++!
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          The Amazing Things About C++ 🌟
        </h2>

        <div className="grid gap-4">
          <FeatureCard
            emoji="⚡"
            title="High Performance"
            description="C++ gives you incredible speed and direct hardware control. It's like having a 
            high-performance sports car that you can customize down to the smallest detail."
          />

          <FeatureCard
            emoji="🎮"
            title="Game Development"
            description="Many popular game engines use C++. If you dream of creating games, 
            C++ is your gateway to the gaming industry."
          />

          <FeatureCard
            emoji="🔧"
            title="Versatility"
            description="From systems programming to applications, C++ can do it all. 
            It's like having a Swiss Army knife in your programming toolkit."
          />

          <FeatureCard
            emoji="📚"
            title="Rich Legacy"
            description="With decades of resources and a mature ecosystem, you'll never run out of 
            learning materials and libraries to use."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          What Can You Build With C++? 🚀
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <h3 className="text-xl text-blue-400 font-medium mb-3">🎮 Games</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Unreal Engine Games</li>
              <li>• Unity Engine Components</li>
              <li>• AAA Game Titles</li>
              <li>• Game Physics Engines</li>
            </ul>
          </div>

          <div className="p-6 bg-purple-900/20 rounded-lg border border-purple-700/30">
            <h3 className="text-xl text-purple-400 font-medium mb-3">💻 Systems</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Operating Systems</li>
              <li>• Device Drivers</li>
              <li>• Embedded Systems</li>
              <li>• High-Performance Software</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Why C++ is Powerful 💪
        </h2>

        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
            <h3 className="text-xl text-green-400 font-medium mb-3">🎓 Learning Journey</h3>
            <p className="text-gray-300 leading-relaxed">
              C++ teaches you important programming concepts:
              <ul className="mt-3 space-y-2 list-disc pl-6">
                <li>Memory management</li>
                <li>Object-oriented programming</li>
                <li>Low-level system interaction</li>
                <li>Performance optimization</li>
              </ul>
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <h3 className="text-xl text-purple-400 font-medium mb-3">💼 Career Opportunities</h3>
            <p className="text-gray-300 leading-relaxed">
              C++ opens doors to exciting careers:
              <ul className="mt-3 space-y-2 list-disc pl-6">
                <li>Game Developer</li>
                <li>Systems Programmer</li>
                <li>Software Engineer</li>
                <li>Embedded Systems Developer</li>
              </ul>
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Ready to Start? 🎉
        </h2>

        <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
          <div className="space-y-4 text-gray-300">
            <p>Here's what makes C++ great for your programming journey:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Strong foundation in programming concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Direct control over computer resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Build high-performance applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Large community and extensive resources</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyCPP;
