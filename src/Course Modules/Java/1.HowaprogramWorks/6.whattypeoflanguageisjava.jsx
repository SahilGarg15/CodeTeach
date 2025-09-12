import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';

const WhatTypeOfLanguageIsJava = () => {
  const javaFeatures = [
    { icon: "🎯", text: "Easy to read and write" },
    { icon: "📚", text: "Similar to English" },
    { icon: "🛠️", text: "Handles complex tasks automatically" }
  ];

  const objectFeatures = [
    { icon: "📦", text: "Organizes code into objects" },
    { icon: "🔄", text: "Reusable components" },
    { icon: "🏗️", text: "Models real-world things" }
  ];

  const platformFeatures = [
    { icon: "💻", text: "Runs anywhere" },
    { icon: "🔒", text: "Secure by design" },
    { icon: "🚀", text: "Write once, run anywhere" }
  ];

  const specialFeatures = [
    { icon: "🔄", text: "Automatic Memory Management" },
    { icon: "🛡️", text: "Strong Type Safety" },
    { icon: "📚", text: "Rich Standard Library" }
  ];

  const useCases = [
    { icon: "📱", text: "Android Apps" },
    { icon: "💼", text: "Enterprise Software" },
    { icon: "🎮", text: "Game Development" }
  ];

  const conceptSections = [
    {
      icon: "📚",
      title: "High-Level Language",
      content: [
        "Java abstracts away complex low-level details",
        "Code is easy to read and understand",
        "Automatic memory management removes manual memory handling"
      ],
      code: `// Simple and readable code
String message = "Hello World";
System.out.println(message);`
    },
    {
      icon: "🎯",
      title: "Object-Oriented",
      content: [
        "Everything in Java is organized into objects",
        "Programs are built using classes and objects",
        "Promotes code reuse and modularity"
      ],
      code: `class Car {
    String model;
    void start() {
        System.out.println("Starting " + model);
    }
}`
    }
  ];

  const examples = {
    simpleJava: {
      title: '👋 Your First Java Program',
      code: `public class Main {
    public static void main(String[] args) {
        // This is a simple Java program
        System.out.println("Welcome to Java!");
        
        // Simple calculation
        int result = 10 + 5;
        System.out.println("10 + 5 = " + result);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    objectExample: {
      title: '📦 Object-Oriented Example',
      code: `class Car {
    String model;
    void start() {
        System.out.println("Starting " + model);
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.model = "Tesla";
        myCar.start();  // Prints: Starting Tesla
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="What Type of Language is Java? ☕"
        description="Java is like a Swiss Army knife of programming languages - it's versatile, reliable, and designed to help you build almost anything! Let's explore what makes Java special. 🚀"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KeyFeatures
          title="High-Level Language 📝"
          items={javaFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Object-Oriented 🎨"
          items={objectFeatures}
          variant="purple"
        />
        <KeyFeatures
          title="Platform Independent 🌐"
          items={platformFeatures}
          variant="green"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Java in Action! 💫</h2>
        <CodeSnippet {...examples.simpleJava} />
        <CodeSnippet {...examples.objectExample} />
      </section>

      <ImportantNote
        title="Coming Up Next! 📚"
        points={[
          "We'll dive deep into object-oriented programming concepts",
          "Learn about classes, objects, and methods",
          "Understand Java's type system",
          "Explore Java's standard library"
        ]}
        variant="blue"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Java's Special Features ✨"
          items={specialFeatures}
          variant="indigo"
        />
        <KeyFeatures
          title="Where Java Shines 🌟"
          items={useCases}
          variant="purple"
        />
      </div>

      <Summary 
        title="Key Points 📝"
        description={`
          Java combines the best of many worlds:
          • High-level language for easy coding
          • Object-oriented for better organization
          • Platform independent for maximum flexibility
          • Secure and reliable for enterprise use
          • Rich ecosystem for any type of development
        `}
        variant="green"
      />
    </div>
  );
};

export default WhatTypeOfLanguageIsJava;
