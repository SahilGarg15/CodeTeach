import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import BinaryExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/BinaryExplanation';

const DatatypesinJava = () => {
  const examples = {
    basicTypes: {
      title: '🔢 Basic Data Types',
      code: `// Numbers without decimals
int age = 25;              // For storing whole numbers
long population = 7800000000L;  // For very big whole numbers

// Numbers with decimals
double height = 5.8;       // For storing decimal numbers
float temperature = 98.6f; // Another way to store decimals

// Single character
char grade = 'A';          // For storing a single character

// True or False
boolean isStudent = true;  // For yes/no type values

// Text
String name = "John";      // For storing text`,
      showLineNumbers: true,
      showCopyButton: true
    },
    
    simpleExample: {
      title: '👨‍🎓 Student Information Example',
      code: `public class StudentInfo {
    public static void main(String[] args) {
        // Store student information
        String name = "John";
        int age = 15;
        char grade = 'A';
        double height = 5.8;
        boolean isPresent = true;
        
        // Print student information
        System.out.println("Student Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Grade: " + grade);
        System.out.println("Height: " + height);
        System.out.println("Present Today: " + isPresent);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    practiceQuestion: {
      title: '🎯 Practice Example',
      code: `public class AboutMe {
    public static void main(String[] args) {
        // Try creating variables about yourself!
        // 1. Your name
        // 2. Your age
        // 3. Your favorite grade (A, B, C, etc.)
        // 4. Are you a student?
        
        // Then print them all!
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    memoryUsage: {
      title: '💾 Memory Usage',
      code: `/*
Memory used by each type:

int: 4 boxes in memory
long: 8 boxes in memory
byte: 1 box in memory
short: 2 boxes in memory
float: 4 boxes in memory
double: 8 boxes in memory
char: 2 boxes in memory
boolean: 1 box in memory

Note: One box = 1 byte of memory
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },

    printingVariables: {
      title: '🖨️ How to Print Variables',
      code: `public class PrintingExample {
    public static void main(String[] args) {
        // First, let's create some variables
        String name = "John";
        int age = 20;
        double height = 5.9;
        boolean isStudent = true;
        char grade = 'A';

        // Method 1: Using + to combine text and variables
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);

        // Method 2: Using printf for formatted output
        System.out.printf("Height: %.1f feet\\n", height);
        
        // Method 3: Multiple variables in one line
        System.out.println("Grade " + grade + " student: " + isStudent);
        
        // Method 4: Using String.format
        String message = String.format("%s is %d years old", name, age);
        System.out.println(message);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    simpleMemoryExample: {
      title: '🎯 Understanding Memory Simply',
      code: `// Small numbers (use int - 4 boxes)
int age = 25;
int score = 95;

// Big numbers (use long - 8 boxes)
long population = 7800000000L;

// Decimal numbers (use double - 8 boxes)
double price = 99.99;

// Single letters/symbols (use char - 2 boxes)
char grade = 'A';

// Yes/No values (use boolean - 1 box)
boolean isStudent = true;

// Text (String - varies based on text length)
String name = "John";  // Uses more boxes for longer names`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const conceptSections = [
    {
      icon: "🔢",
      title: "Number Types",
      content: [
        "Java has different types for storing numbers:",
        "• int - for whole numbers (-2 billion to 2 billion)",
        "• long - for very big whole numbers",
        "• double - for decimal numbers (most common)",
        "• float - for decimal numbers (less precise)"
      ],
      code: `int age = 25;
long population = 7800000000L;
double price = 19.99;
float temperature = 98.6f;`
    },
    {
      icon: "📝",
      title: "Text and Characters",
      content: [
        "For storing text and characters:",
        "• String - for text of any length",
        "• char - for single characters"
      ],
      code: `String name = "John";
char grade = 'A';`
    },
    {
      icon: "✅",
      title: "Boolean Type",
      content: [
        "Boolean type stores true/false values",
        "Perfect for yes/no conditions"
      ],
      code: `boolean isStudent = true;
boolean isPassed = false;`
    }
  ];

  const numberTypes = [
    { icon: "1️⃣", text: "int (whole numbers)" },
    { icon: "🔄", text: "long (big numbers)" },
    { icon: "📊", text: "double (decimals)" },
    { icon: "🌡️", text: "float (simple decimals)" }
  ];

  const textTypes = [
    { icon: "📝", text: "String (text)" },
    { icon: "🔤", text: "char (single character)" },
    { icon: "✅", text: "boolean (true/false)" }
  ];

  const memoryItems = [
    { icon: "📦", name: "byte", size: "1 byte" },
    { icon: "📦📦", name: "short", size: "2 bytes" },
    { icon: "📦📦📦📦", name: "int", size: "4 bytes" },
    { icon: "📦×8", name: "long", size: "8 bytes" },
    { icon: "💧", name: "float", size: "4 bytes" },
    { icon: "💧💧", name: "double", size: "8 bytes" },
    { icon: "🔤", name: "char", size: "2 bytes" },
    { icon: "✅", name: "boolean", size: "1 byte" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Understanding Data Types in Java 📝"
        description="Think of data types as different kinds of containers. Just like you wouldn't store water in a pencil box, in Java, different types of information need different types of containers! Let's learn about them in a simple way! 🎈"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Number Types 🔢"
          items={numberTypes}
          variant="blue"
        />
        <KeyFeatures
          title="Text Types 📝"
          items={textTypes}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <BinaryExplanation
        title="Memory Usage 💾"
        description="Think of memory like boxes that store your data. Different types need different numbers of boxes!"
        items={memoryItems}
      />

      <ImportantNote
        title="Important Rules to Remember!"
        points={[
          "Text always goes in double quotes: \"like this\"",
          "Single characters go in single quotes: 'A'",
          "Numbers don't need quotes: 42",
          "Decimal numbers need a dot: 3.14",
          "Long numbers need 'L' at the end: 1000000L",
          "Float numbers need 'f' at the end: 3.14f"
        ]}
        variant="yellow"
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicTypes} />
        <CodeSnippet {...examples.simpleExample} />
        <CodeSnippet {...examples.printingVariables} />
      </section>

      <MistakesToAvoid
        title="Common Mistakes to Watch Out For"
        mistakes={[
          "Using the wrong quotes for String vs char",
          "Forgetting L for long numbers",
          "Forgetting f for float numbers",
          "Using int for decimal numbers",
          "Not considering size limits"
        ]}
        alternatives={[
          "Double quotes for String: \"text\"",
          "Single quotes for char: 'A'",
          "Use double for most decimal numbers",
          "Check value ranges before choosing type",
          "When in doubt, use int for whole numbers and double for decimals"
        ]}
      />

      <HandsOn
        title="Practice Time! 💪"
        description="Create variables about yourself using different data types!"
        defaultCode={examples.practiceQuestion.code}
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these key points about Java data types:
          • Use int for whole numbers
          • Use double for decimal numbers
          • Use String for text
          • Use char for single characters
          • Use boolean for true/false values
          • Always choose the right type for your data
        `}
        variant="green"
      />
    </div>
  );
};

export default DatatypesinJava;