import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';

const VariablesInJava = () => {
  const examples = {
    variableDeclaration: {
      title: '📝 Variable Declaration',
      code: `// Basic variable declaration
int age = 25;
String name = "John";
double price = 19.99;
boolean isStudent = true;`,
      showLineNumbers: true,
      showCopyButton: true
    },
    namingConventions: {
      title: '🏷️ Naming Conventions',
      code: `// Good variable names
int userAge = 25;
String firstName = "John";
double priceInDollars = 19.99;

// Bad variable names (avoid these)
int a = 25;          // too short
String NAME = "John"; // uppercase for regular variables
double p$ = 19.99;    // special characters`,
      showLineNumbers: true,
      showCopyButton: true
    },
    bestPractices: {
      title: '✨ Best Practices Example',
      code: `public class VariableExample {
    // Class-level constants (use uppercase)
    private static final double TAX_RATE = 0.08;
    
    public static void main(String[] args) {
        // Descriptive variable names
        int numberOfStudents = 25;
        double totalPrice = 99.99;
        boolean isActive = true;
        
        // Initialize variables when declared
        String statusMessage = "Ready";
        
        // Use meaningful names for calculations
        double priceWithTax = totalPrice * (1 + TAX_RATE);
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    keywords: {
      title: '🚫 Reserved Keywords',
      code: `// These are invalid variable names (Don't do this!)
int public = 5;        // Error: 'public' is a keyword
String class = "Test"; // Error: 'class' is a keyword
boolean if = true;     // Error: 'if' is a keyword
int new = 42;         // Error: 'new' is a keyword

// Use these instead
int publicValue = 5;
String className = "Test";
boolean isValid = true;
int newNumber = 42;`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const dataTypes = [
    { icon: "🔢", text: "int - Whole numbers" },
    { icon: "💬", text: "String - Text" },
    { icon: "📊", text: "double - Decimal numbers" },
    { icon: "✅", text: "boolean - True/False" }
  ];

  const namingRules = [
    { icon: "✓", text: "Start with letters, $ or _" },
    { icon: "✓", text: "Use camelCase for names" },
    { icon: "❌", text: "Don't start with numbers" },
    { icon: "❌", text: "No keywords as names" }
  ];

  const conceptSections = [
    {
      icon: "📦",
      title: "What are Variables?",
      content: [
        "Variables are containers for storing data values in Java.",
        "Think of them as labeled boxes where you can store different types of information."
      ],
      code: `int age = 25;
String name = "John";
double price = 19.99;
boolean isStudent = true;`
    },
    {
      icon: "🏷️",
      title: "Naming Conventions",
      content: [
        "Variables should have meaningful names that describe their purpose",
        "Use camelCase: first word lowercase, then capitalize each word"
      ],
      code: `// Good names
int studentAge;
String firstName;
double priceInDollars;

// Bad names
int a;
String NAME;
double x;`
    }
  ];

  const keywordExamples = [
    { icon: "🚫", text: "public" },
    { icon: "🚫", text: "class" },
    { icon: "🚫", text: "void" },
    { icon: "🚫", text: "if" },
    { icon: "🚫", text: "else" },
    { icon: "🚫", text: "for" },
    { icon: "🚫", text: "while" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Variables in Java 🎯"
        description="Variables are containers for storing data values in Java. Think of them as labeled boxes where you can store different types of information. Let's learn how to create and use them properly! 📦"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Common Data Types 📊"
          items={dataTypes}
          variant="blue"
        />
        <KeyFeatures
          title="Naming Rules ⚡"
          items={namingRules}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.variableDeclaration} />
        <CodeSnippet {...examples.namingConventions} />
        <CodeSnippet {...examples.bestPractices} />
      </section>

      <ImportantNote
        title="Reserved Keywords ⛔"
        points={[
          "Keywords are special words that Java reserves for its own use",
          "You cannot use these words as variable names",
          "They have special meaning in the language",
          "Always check if a word is a keyword before using it as a variable name"
        ]}
        variant="yellow"
      />

      <KeyFeatures
        title="Common Keywords"
        items={keywordExamples}
        variant="red"
      />

      <MistakesToAvoid
        title="Common Mistakes to Avoid"
        mistakes={[
          "Using reserved keywords as variable names",
          "Starting variable names with numbers",
          "Using spaces in variable names",
          "Not initializing variables before use"
        ]}
        alternatives={[
          "Use descriptive, meaningful names",
          "Follow camelCase convention",
          "Initialize variables when declaring",
          "Use proper data types for values"
        ]}
      />

      <Summary 
        title="Key Takeaways 📚"
        description={`
          Remember these essential points about variables:
          • Variables are containers for storing data
          • Always initialize variables when declaring them
          • Use meaningful and descriptive names
          • Follow Java naming conventions
          • Avoid reserved keywords
        `}
        variant="green"
      />
    </div>
  );
};

export default VariablesInJava;
